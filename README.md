adb reverse tcp:54321 tcp:54321
supabase start
npx expo run:android

adb -s emulator-5554 reverse tcp:54321 tcp:54321
adb -s emulator-5556 reverse tcp:54321 tcp:54321
npx expo run:android -d