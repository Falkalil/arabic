"""توليد القراءة النموذجية بصوت «حامد» السعودي (ar-SA-HamedNeural) لكل نصوص الكتاب.
على جهازك (يحتاج إنترنت):  pip install edge-tts   ثم من مجلد grade3:  python tools/gen_audio.py
ينشئ audio/<key>.mp3 و audio/<key>.vtt و audio/index.json، ويستخدمها الكتاب تلقائيًا بدل صوت الجهاز."""
import asyncio, re, os, json, edge_tts
VOICE, RATE = 'ar-SA-HamedNeural', '-15%'
TX = json.load(open('tools/texts.json', encoding='utf-8'))
def spoken(s):
    s = re.sub(r'\[\[([^|\]]+)\|[^\]]+\]\]', r'\1', s).replace(' | ', '، ')
    return re.sub(r'[{}«»"]', '', s).replace('ﷺ', 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ').replace('الْا', 'الِا')
async def one(key, text):
    if os.path.exists(f'audio/{key}.mp3') and os.path.getsize(f'audio/{key}.mp3') > 1000: return
    com = edge_tts.Communicate(spoken(text), VOICE, rate=RATE, boundary='WordBoundary')
    cues, audio = [], bytearray()
    async for ch in com.stream():
        if ch['type'] == 'audio': audio += ch['data']
        elif ch['type'] == 'WordBoundary': cues.append(ch['offset'] / 1e7)
    open(f'audio/{key}.mp3', 'wb').write(audio)
    f = lambda t: '%02d:%02d:%06.3f' % (t // 3600, t % 3600 // 60, t % 60)
    open(f'audio/{key}.vtt', 'w', encoding='utf-8').write('WEBVTT\n\n' + ''.join(f'{f(t)} --> {f(t + .3)}\nw\n\n' for t in cues))
async def main():
    os.makedirs('audio', exist_ok=True); done = []
    for k, t in TX.items():
        try: await one(k, t); done.append(k); print('✓', k)
        except Exception as e: print('✗', k, e)
    json.dump(done, open('audio/index.json', 'w', encoding='utf-8'))
asyncio.run(main())
