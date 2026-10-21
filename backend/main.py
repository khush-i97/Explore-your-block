"""Explore Your Block back end (FastAPI). Follows docs/API.md, mounted under /api.

Run:  uvicorn main:app --reload --port 8000   (from this folder, inside its venv)

Wired: Gemini answers for Ask Ollie (/voice/ask, keyword answers as backup), Modulate speech-to-text
(/voice/listen) and Inworld text-to-speech (/ollie/speak), when their keys are set. Not wired yet (mock answers): k-ID claim, photo check, FastSpring checkout.
"""
import hashlib
import hmac
import base64
import json
import os
import re
from collections import OrderedDict
from pathlib import Path
from typing import Literal

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, File, Form, HTTPException, Request, Response, UploadFile
from pydantic import BaseModel, Field

# keys live in app/.env (shared with the front end); only server-side names are read here
load_dotenv(Path(__file__).resolve().parents[1] / "app" / ".env")

Band = Literal["kid", "teen", "adult"]
Perm = Literal["yes", "ask", "no"]

# ---------- data (same as prototype/prototype.html) ----------
PLACES = {
    "md": {"name": "Mission Dolores", "cat": "History", "lat": 37.76439, "lng": -122.42703},
    "park": {"name": "Dolores Park", "cat": "Park", "lat": 37.75965, "lng": -122.42608},
    "hydrant": {"name": "The Golden Fire Hydrant", "cat": "History", "lat": 37.7584, "lng": -122.4281},
    "clarion": {"name": "Clarion Alley murals", "cat": "Art", "lat": 37.7630, "lng": -122.4215},
    "playground": {"name": "Helen Diller Playground", "cat": "Playground", "lat": 37.7601, "lng": -122.4273},
    "birite": {"name": "Bi-Rite Creamery", "cat": "Ice cream", "lat": 37.7616, "lng": -122.4258},
    "tartine": {"name": "Tartine Bakery", "cat": "Bakery", "lat": 37.7614, "lng": -122.4241},
    "ritual": {"name": "Ritual Coffee Roasters", "cat": "Café", "lat": 37.7564, "lng": -122.4214},
    "roxie": {"name": "Roxie Theater", "cat": "Movies", "lat": 37.7650, "lng": -122.4228},
    "foreign": {"name": "Foreign Cinema", "cat": "Dinner", "lat": 37.7564, "lng": -122.4193},
}
# kid + teen spots never include places that sell alcohol; anything unconfirmed stays adult-only
AGES: dict[str, list[Band]] = {
    "park": ["kid", "teen", "adult"], "playground": ["kid", "adult"], "birite": ["kid", "teen", "adult"],
    "md": ["kid", "teen", "adult"], "ritual": ["teen", "adult"], "clarion": ["teen", "adult"],
    "tartine": ["adult"], "roxie": ["adult"], "foreign": ["adult"],
}
FOR_BAND: dict[Band, list[str]] = {
    "kid": ["playground", "birite", "park"],
    "teen": ["park", "ritual", "clarion", "birite"],
    "adult": ["md", "tartine", "roxie", "foreign"],
}
FAMILY = ["playground", "birite", "park", "md"]
PARTNERS = [  # made-up partner shops for the demo
    {"name": "Mission Boba", "deal": "20% off", "cat": "Boba", "teen": True},
    {"name": "Lucky Comics", "deal": "10% off", "cat": "Comics", "teen": True},
    {"name": "Pixel Pit Arcade", "deal": "2 free tokens", "cat": "Arcade", "teen": True},
    {"name": "Sunday Coffee Co.", "deal": "15% off", "cat": "Coffee", "teen": True},
    {"name": "Valencia Vinyl", "deal": "10% off", "cat": "Records", "teen": False},
]
PASSES = {
    "teen": {"id": "teen-pass", "name": "Teen Pass", "price": 2.99, "interval": "month"},
    "adult": {"id": "block-pass", "name": "Block Pass", "price": 4.99, "interval": "month"},
}
STRICTNESS = {"no": 0, "ask": 1, "yes": 2}


def band_of(age: int) -> Band:
    return "kid" if age < 13 else "teen" if age < 18 else "adult"


def spot(key: str) -> dict:
    return {"id": key, **PLACES[key], "ages": AGES[key]}


# ---------- Ask Ollie (same answers as the prototype's ollieAnswer) ----------
def ollie_answer(text: str, band: Band, family: bool, group: bool) -> tuple[list[str], str]:
    t = text.lower()
    if family:
        keys, reply = ["playground", "birite", "park"], "Easy family plan: the playground first, then Bi-Rite for ice cream, then a picnic in Dolores Park."
    elif group:
        keys, reply = ["park", "birite", "md"], "These work for everyone in your group, and they follow the youngest person's rules."
    elif band == "adult":
        if re.search(r"date|romantic|dinner", t):
            keys, reply = ["foreign", "roxie", "tartine"], "Dinner at Foreign Cinema, a film at the Roxie, and pastries at Tartine in the morning."
        elif re.search(r"rain|indoor|wet", t):
            keys, reply = ["roxie", "md", "tartine"], "Stay dry: a matinee at the Roxie, the old mission, then coffee and bread at Tartine."
        elif re.search(r"quiet|read|calm|work", t):
            keys, reply = ["ritual", "md"], "Ritual for a coffee and a corner seat, then a quiet walk past Mission Dolores."
        else:
            keys, reply = ["md", "tartine", "roxie"], "Here's a classic Mission evening: history, bread, then a movie."
    else:
        if re.search(r"cheap|eat|food|\$|snack", t):
            keys, reply = ["birite", "ritual"], "Ice cream at Bi-Rite and a drink at Ritual. Easy on the wallet."
        elif re.search(r"photo|pic|insta|mural|art", t):
            keys, reply = ["clarion", "park"], "Clarion Alley's murals, then the top of Dolores Park at sunset for the skyline."
        elif re.search(r"study|homework|work", t):
            keys, reply = ["ritual", "park"], "Ritual has tables to study at, and the park is right there for a break."
        else:
            keys, reply = ["park", "ritual", "birite"], "Dolores Park is the spot. Grab a coffee at Ritual or ice cream at Bi-Rite on the way."
    # never suggest a spot the band can't go to (no alcohol for kids and teens)
    return [k for k in keys if band in AGES[k]], reply


def redact(text: str) -> tuple[str, list[str]]:
    hidden: list[str] = []

    def hide(kind: str):
        def sub(_m):
            hidden.append(kind)
            return "•••"
        return sub

    out = re.sub(r"\b(\+?\d[\d\s().-]{7,}\d)\b", hide("phone number"), text)
    out = re.sub(r"\b\d{2,5}\s+[A-Za-z]+\s+(st|street|ave|avenue|rd|road|blvd)\b", hide("address"), out, flags=re.I)
    return out, hidden


# ---------- routes ----------
api = APIRouter(prefix="/api")


@api.get("/health")
def health():
    return {"ok": True, "keys": {
        "kid": bool(os.getenv("KID_SECRET_KEY")),
        "inworld": bool(os.getenv("INWORLD_API_KEY")),
        "modulate": bool(os.getenv("MODULATE_API_KEY")),
        "fastspring": bool(os.getenv("FASTSPRING_WEBHOOK_SECRET")),
    }}


class ClaimIn(BaseModel):
    claim_token: str


@api.post("/kid/claim")
def kid_claim(body: ClaimIn):
    # TODO(k-ID): POST the token to k-ID's /client/claim with KID_SECRET_KEY once we have the URL,
    # then return { session: { age, band, jurisdiction, permissions } } and store it.
    if not os.getenv("KID_SECRET_KEY"):
        raise HTTPException(501, "KID_SECRET_KEY is not set")
    raise HTTPException(501, "Claim call not wired yet: waiting on the k-ID /client/claim URL")


@api.get("/spots")
def spots(band: Band, family: bool = False):
    keys = FAMILY if family else FOR_BAND[band]
    return {"spots": [spot(k) for k in keys if band in AGES[k] or family]}


class Member(BaseModel):
    name: str
    age: int
    jurisdiction: str = "US"
    permissions: dict[str, Perm] = {}


class GroupIn(BaseModel):
    members: list[Member]


@api.post("/group/spots")
def group_spots(body: GroupIn):
    if not body.members:
        raise HTTPException(400, "members is empty")
    bands = [band_of(m.age) for m in body.members]
    youngest = min(body.members, key=lambda m: m.age)
    names = {n for m in body.members for n in m.permissions}
    # the strictest member's value wins; a missing value counts as "no"
    rules = {n: min((m.permissions.get(n, "no") for m in body.members), key=STRICTNESS.__getitem__) for n in names}
    if "kid" in bands:
        rules["real-time-location-sharing"] = "no"
    return {
        "spots": [spot(k) for k in AGES if all(b in AGES[k] for b in bands)],
        "youngest": {"name": youngest.name, "age": youngest.age, "jurisdiction": youngest.jurisdiction},
        "rules": rules,
    }


class Turn(BaseModel):
    from_: Literal["me", "ollie"] = Field(alias="from")
    text: str


class AskIn(BaseModel):
    text: str
    band: Band
    group: bool = False
    family: bool = False
    history: list[Turn] = []  # the last few chat messages, so "Closer?" or "Cheaper?" make sense


# what Ollie knows about each spot, for the model
ABOUT = {
    "md": "the old adobe mission chapel from 1791, the oldest building in San Francisco; history",
    "park": "big sunny park with a hill and a skyline view; picnics, sunsets, hanging out",
    "playground": "Helen Diller Playground in Dolores Park; slides and climbing for little kids",
    "birite": "famous ice cream shop, cheap treat",
    "tartine": "famous bakery: bread, pastries, coffee; bread sells out early",
    "ritual": "specialty coffee roaster with tables to sit, read or study; cheap",
    "roxie": "historic indie movie theater, matinees and late shows",
    "foreign": "dinner restaurant with films in the courtyard; serves alcohol; date night",
    "clarion": "alley covered in murals and street art; great for photos",
}
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
WHO = {"teen": "a teenager (13 to 17)", "adult": "an adult"}


def allowed_spots(band: Band, family: bool, group: bool) -> list[str]:
    if family:
        return FAMILY
    if group:  # we don't know who's in the group here, so only spots that suit everyone
        return [k for k in AGES if {"kid", "teen", "adult"} <= set(AGES[k])]
    return [k for k in AGES if band in AGES[k]]


async def gemini_answer(body: AskIn, text: str) -> tuple[list[str], str] | None:
    """Ollie's answer from Gemini, limited to spots this person may go to. None means: use the keyword answer."""
    key = os.getenv("GEMINI_API_KEY")
    if not key or body.band == "kid":  # kids don't chat with Ollie
        return None
    spots = allowed_spots(body.band, body.family, body.group)
    who = ("a parent planning a family outing with young kids" if body.family
           else "a mixed group; follow the youngest person's rules" if body.group else WHO[body.band])
    system = (
        "You are Ollie, a cheerful otter who helps people plan outings in San Francisco's Mission District. "
        f"You are talking to {who}. Reply in one or two short, warm sentences, like a friend. "
        "Suggest 1 to 3 spots, chosen ONLY from this list (id: name, what it is):\n"
        + "\n".join(f"{k}: {PLACES[k]['name']}, {ABOUT[k]}" for k in spots)
        + "\nOnly name places from the list. If nothing fits, say so kindly and suggest the closest match. "
        "If the question isn't about outings in the neighborhood, gently steer back to that. "
        "Never ask for personal details like names, addresses or phone numbers."
        + (" Never suggest anywhere that serves alcohol." if body.band != "adult" or body.family or body.group else "")
    )
    contents = [{"role": "user" if t.from_ == "me" else "model", "parts": [{"text": redact(t.text)[0]}]} for t in body.history[-6:]]
    contents.append({"role": "user", "parts": [{"text": text}]})
    payload = {
        "systemInstruction": {"parts": [{"text": system}]},
        "contents": contents,
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {"type": "OBJECT", "required": ["reply", "spots"], "properties": {
                "reply": {"type": "STRING"}, "spots": {"type": "ARRAY", "items": {"type": "STRING", "enum": spots}}}},
            "temperature": 0.7, "maxOutputTokens": 300,
        },
    }
    model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.post(GEMINI_URL.format(model=model), headers={"x-goog-api-key": key}, json=payload)
        r.raise_for_status()
        out = json.loads(r.json()["candidates"][0]["content"]["parts"][0]["text"])
    except (httpx.HTTPError, KeyError, IndexError, ValueError) as e:
        print(f"[ask] Gemini failed ({e.__class__.__name__}: {str(e)[:120]}), using keyword answer")
        return None
    keys = [k for k in dict.fromkeys(out.get("spots", [])) if k in spots][:3]  # never trust the model's list
    reply = str(out.get("reply", "")).strip()
    return (keys, reply) if reply else None


@api.post("/voice/ask")
async def voice_ask(body: AskIn):
    clean, hidden = redact(body.text.strip())
    if not clean:
        raise HTTPException(400, "text is empty")
    answer = await gemini_answer(body, clean)
    source = "gemini" if answer else "keywords"
    keys, reply = answer or ollie_answer(body.text, body.band, body.family, body.group)
    return {"transcript": clean, "redacted": hidden, "emotion": None, "reply": reply, "keys": keys,
            "spots": [spot(k) for k in keys], "source": source}


MODULATE_STT = "https://platform.modulate.ai/api/velma-2-stt-batch"
AUDIO_EXT = {"audio/webm": "webm", "audio/ogg": "ogg", "audio/mp4": "mp4", "audio/mpeg": "mp3", "audio/wav": "wav", "audio/x-wav": "wav"}
MAX_AUDIO = 10 * 1024 * 1024  # ~10 MB; a 15-second clip is far smaller


@api.post("/voice/listen")
async def voice_listen(audio: UploadFile = File(...), band: Band = Form(...)):
    """Speech to text with Modulate. Kids never get the mic (k-ID: no voice chat under 13)."""
    if band == "kid":
        raise HTTPException(403, "Voice input is off for kids")
    key = os.getenv("MODULATE_API_KEY")
    if not key:
        raise HTTPException(501, "MODULATE_API_KEY is not set")
    data = await audio.read(MAX_AUDIO + 1)
    if not data:
        raise HTTPException(400, "empty recording")
    if len(data) > MAX_AUDIO:
        raise HTTPException(413, "recording is too long")
    ext = AUDIO_EXT.get((audio.content_type or "").split(";")[0], "webm")
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(MODULATE_STT, headers={"X-API-Key": key},
                                  files={"upload_file": (f"voice.{ext}", data, audio.content_type or "audio/webm")},
                                  data={"emotion_signal": "true", "speaker_diarization": "false"})
    except httpx.HTTPError as e:
        raise HTTPException(502, f"Modulate unreachable: {e.__class__.__name__}")
    if r.status_code != 200:
        raise HTTPException(502, f"Modulate error {r.status_code}")
    out = r.json()
    emotions = [u.get("emotion") for u in out.get("utterances", []) if u.get("emotion") not in (None, "Unknown")]
    return {"text": out.get("text", "").strip(), "emotion": emotions[0] if emotions else None}


INWORLD_TTS = "https://api.inworld.ai/tts/v1/voice"
# Pick voices in Inworld's TTS Playground and set them in app/.env. A band without a voice falls back
# to the browser's own voice in the app. Ollie doesn't speak to kids.
VOICE_ENV = {"teen": "INWORLD_VOICE_TEEN", "adult": "INWORLD_VOICE_ADULT"}
_speech_cache: OrderedDict[tuple[str, str, str], bytes] = OrderedDict()  # Ollie repeats lines; don't pay twice


class SpeakIn(BaseModel):
    text: str
    band: Band = "adult"
    group: bool = False


@api.post("/ollie/speak")
async def ollie_speak(body: SpeakIn):
    """Text to Ollie's voice with Inworld. Returns audio/mpeg, or 501 so the app uses the browser's voice."""
    if body.band == "kid":
        raise HTTPException(403, "Ollie doesn't speak to kids")
    key = os.getenv("INWORLD_API_KEY")
    voice = os.getenv(VOICE_ENV[body.band])
    if not key or not voice:
        raise HTTPException(501, "Inworld voice not set up for this band")
    text = body.text.strip()[:600]
    if not text:
        raise HTTPException(400, "text is empty")
    model = os.getenv("INWORLD_MODEL", "inworld-tts-2")
    cache_key = (voice, model, text)
    if cache_key in _speech_cache:
        _speech_cache.move_to_end(cache_key)
        return Response(_speech_cache[cache_key], media_type="audio/mpeg")
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(INWORLD_TTS, headers={"Authorization": f"Basic {key}"},
                                  json={"text": text, "voiceId": voice, "modelId": model, "audioConfig": {"audioEncoding": "MP3"}})
    except httpx.HTTPError as e:
        raise HTTPException(502, f"Inworld unreachable: {e.__class__.__name__}")
    if r.status_code != 200:
        raise HTTPException(502, f"Inworld error {r.status_code}")
    audio = base64.b64decode(r.json()["audioContent"])
    _speech_cache[cache_key] = audio
    if len(_speech_cache) > 200:
        _speech_cache.popitem(last=False)
    return Response(audio, media_type="audio/mpeg")


@api.post("/photo/check")
async def photo_check(spot_id: str = Form(...), image: UploadFile = File(...)):
    # TODO: real image match. Accepts any photo of a known spot for now.
    if spot_id not in PLACES:
        raise HTTPException(404, "unknown spot")
    await image.read()
    return {"match": True, "confidence": 0.93, "spot": {"id": spot_id, **PLACES[spot_id]}, "mock": True}


@api.get("/deals")
def deals(band: Band):
    if band == "kid":
        return {"pass": None, "partners": []}
    teen = band == "teen"
    return {"pass": PASSES[band], "partners": [p for p in PARTNERS if p["teen"] or not teen]}


class CheckoutIn(BaseModel):
    product: Literal["block-pass", "teen-pass", "family-pack"]
    band: Band
    can_buy: Perm


@api.post("/checkout")
def checkout(body: CheckoutIn):
    if body.can_buy == "no" or body.band == "kid":
        raise HTTPException(403, "Buying is off for this player")
    if body.can_buy == "ask":
        return {"needs_parent": True}
    # TODO(FastSpring): create a session in the sandbox store and return its URL
    return {"checkout_url": f"https://example.test/checkout/{body.product}", "mock": True}


@api.post("/fastspring/webhook")
async def fastspring_webhook(request: Request):
    secret = os.getenv("FASTSPRING_WEBHOOK_SECRET")
    if not secret:
        raise HTTPException(501, "FASTSPRING_WEBHOOK_SECRET is not set")
    raw = await request.body()
    expected = base64.b64encode(hmac.new(secret.encode(), raw, hashlib.sha256).digest()).decode()
    if not hmac.compare_digest(expected, request.headers.get("X-FS-Signature", "")):
        raise HTTPException(401, "bad signature")
    # TODO: unlock the purchase for each order.completed event (needs storage)
    return {"ok": True}


app = FastAPI(title="Explore Your Block API")
app.include_router(api)
