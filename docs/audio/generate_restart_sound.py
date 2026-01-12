import math
import wave
import struct

# Audio parameters
duration = 0.5  # seconds
sample_rate = 44100
frequency = 440  # Hz (A4 note)

# Create a new WAV file
with wave.open('static/audio/restart.wav', 'w') as wav_file:
    wav_file.setnchannels(1)  # Mono
    wav_file.setsampwidth(2)  # 2 bytes per sample
    wav_file.setframerate(sample_rate)

    # Generate a simple sine wave
    for i in range(int(duration * sample_rate)):
        value = int(32767 * math.sin(2 * math.pi * frequency * i / sample_rate))
        data = struct.pack('<h', value)
        wav_file.writeframes(data)

print("Restart sound generated successfully.")
