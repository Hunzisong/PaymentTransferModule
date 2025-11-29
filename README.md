# PaymentTransferModule – Development Setup

This document explains how to set up your environment to run this React Native app on **iOS** and **Android**.

---

## 1. Prerequisites

You’ll need:

- A Mac running macOS (Apple Silicon recommended)
- A Git client (e.g. Xcode, GitHub Desktop, or `git` via Homebrew)
- Basic terminal usage (you’ll copy–paste commands)

---

## 2. Clone the repository

```bash
git clone <REPO_URL>
cd <PROJECT_FOLDER>   # e.g. cd PaymentTransferModule
```

All remaining commands assume you’re inside the project folder.

---

## 3. Install Homebrew (if not already installed)

Homebrew is the package manager we’ll use for Node, Ruby, etc.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then add Homebrew to your shell config (Apple Silicon example):

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

On Intel Macs, Homebrew’s prefix is usually `/usr/local` instead of `/opt/homebrew`.

---

## 4. Node.js setup (via nvm)

We use `nvm` to manage Node versions. This project expects a modern Node (Node 22 works well).

### 4.1 Install nvm

```bash
brew install nvm
mkdir -p ~/.nvm
```

Add this to `~/.zshrc`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

Reload your shell:

```bash
source ~/.zshrc
```

### 4.2 Install and use Node 22

```bash
nvm install 22
nvm use 22
nvm alias default 22
```

Verify:

```bash
node -v
# should show 22.x.x
```

Newer React Native tooling relies on Node features that are missing in older Node 20.x versions, so Node 22+ is recommended.

---

## 5. iOS setup (Xcode + CocoaPods)

### 5.1 Install Xcode

Install Xcode from the Mac App Store.

- Open Xcode at least once to let it finish installing components.
- Accept any license prompts.

Then run:

```bash
sudo xcode-select -switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

Verify:

```bash
xcodebuild -version
```

You should see the Xcode version printed without errors.

### 5.2 Install Ruby (via Homebrew)

macOS ships with an old Ruby that doesn’t work well with modern CocoaPods. We’ll install a newer Ruby via Homebrew.

```bash
brew install ruby
```

Add Ruby to your PATH (Apple Silicon example):

```bash
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Check:

```bash
ruby -v
# should be >= 3.x.x (not 2.6.x)
```

### 5.3 Install CocoaPods

Use the Ruby we just installed; no sudo needed.

```bash
gem install cocoapods
```

Ruby installs executables into a separate bin directory. From `gem env` you’ll see something like:

> Executable directory: /opt/homebrew/lib/ruby/gems/3.4.0/bin

Add that to your PATH (adjust version if needed):

```bash
echo 'export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="$HOME/.local/share/gem/ruby/3.4.0/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Verify:

```bash
pod --version
```

If you see a version number, CocoaPods is installed correctly.

---

## 6. Install JavaScript dependencies

From the project root:

```bash
nvm use 22
npm install
# or: yarn / pnpm if the project uses those instead
```

This installs all Node/JS dependencies used by the app.

---

## 7. Install iOS (CocoaPods) dependencies

From the project root:

```bash
cd ios
pod install
cd ..
```

This installs the iOS native dependencies (Pods) defined by the project.

---

## 8. Running the app on iOS

### 8.1 Recommended workflow (start Metro manually)

**Terminal 1 – Metro bundler:**

```bash
cd <PROJECT_FOLDER>
nvm use 22
npx react-native start
```

**Terminal 2 – build & run iOS app:**

```bash
cd <PROJECT_FOLDER>
nvm use 22
npx react-native run-ios
```

This will:

- Build the app using Xcode
- Launch the iOS Simulator
- Run the app in the simulator

On the very first build, Xcode can take several minutes. Subsequent builds are usually much faster.

---

## 9. Android setup

If you want to run the app on Android, install Android Studio and SDKs.

### 9.1 Install Android Studio

Download from: [https://developer.android.com/studio](https://developer.android.com/studio)

During setup, ensure you install:

- Android SDK Platform 34 (or latest)
- Android SDK Tools
- Android Emulator
- At least one Android Virtual Device (AVD)

### 9.2 Configure Android environment variables

Add to `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Reload:

```bash
source ~/.zshrc
```

Verify:

```bash
adb devices
```

If it shows a list (or an empty list) without error, `adb` is set up.

---

## 10. Running the app on Android

Make sure an Android emulator is running (or a real device is connected with USB debugging enabled).

**Terminal 1 – Metro bundler:**

```bash
cd <PROJECT_FOLDER>
nvm use 22
npx react-native start
```

**Terminal 2 – build & run Android app:**

```bash
cd <PROJECT_FOLDER>
nvm use 22
npx react-native run-android
```

This will:

- Build the Android app
- Install it on the emulator/device
- Start it automatically

---

## 11. Common issues & fixes

### 11.1 `util.styleText is not a function`

If you see an error like:

```text
error (0 , _util.styleText) is not a function.
```

It usually means you’re using an older Node version.

Fix:

```bash
nvm install 22
nvm use 22
rm -rf node_modules package-lock.json
npm install
```

Then re-run:

```bash
npx react-native start
npx react-native run-ios
```

### 11.2 CocoaPods errors mentioning Ruby or `securerandom`

If you see something like:

```text
securerandom requires Ruby version >= 3.1.0
The current ruby version is 2.6.x
```

It means you’re using the system Ruby (2.6.x). Make sure you:

- Installed Ruby with Homebrew
- Added `/opt/homebrew/opt/ruby/bin` to your PATH
- Re-opened your terminal or sourced `~/.zshrc`

Then reinstall CocoaPods:

```bash
gem install cocoapods
pod --version
```

### 11.3 Very slow first iOS build

The first iOS build can be 5–15 minutes:

- Xcode compiles all native dependencies and caches them
- Subsequent builds are much faster

If it seems stuck:

- Open `ios/PROJECT_NAME.xcworkspace` in Xcode
- Try building from Xcode directly and check the build logs for any red errors

---

## 12. Useful commands summary

| Task              | Command                        |
| ----------------- | ------------------------------ |
| Use Node 22       | `nvm use 22`                   |
| Install JS deps   | `npm install`                  |
| Install iOS pods  | `cd ios && pod install`        |
| Start Metro       | `npx react-native start`       |
| Run iOS app       | `npx react-native run-ios`     |
| Run Android app   | `npx react-native run-android` |
| Check environment | `npx react-native doctor`      |

---

## 13. Notes

- You do **not** need to globally install the React Native CLI; we use `npx` everywhere.
- Avoid running commands under Rosetta (x86_64) on Apple Silicon. In a terminal, `uname -m` should print `arm64`.
- If something fails, re-check:

  - Node version: `node -v`
  - CocoaPods: `pod --version`
  - Xcode: `xcodebuild -version`
  - Android tools: `adb devices`

If you follow this guide from top to bottom, you should be able to clone this repo and run the app on both iOS and Android without prior React Native experience.

---

## 14. Testing biometric authentication in simulator/emulator

The biometric step uses the OS-native dialogs, so you can fully test it in **simulators/emulators** without real hardware.

### 14.1 Flow in the app

1. Launch the app (`npx react-native start` + `npx react-native run-ios` / `run-android`).
1. On the **Transfer** screen:
   - Enter a recipient.
   - Enter an amount.
   - (Optional) enter a note.
1. Tap **Continue** to go to the **Confirm** screen.
1. Tap the **Confirm & authenticate** button:
   - This triggers the biometric prompt if the device supports biometrics.
   - If biometrics are not available, the app falls back to a PIN dialog (demo-only).

### 14.2 iOS Simulator (Face ID / Touch ID)

1. Run the app in the **iOS Simulator**.
2. On the Confirm screen, tap the confirm button to show the native biometric dialog.
3. With the simulator window focused, use the Mac menu bar:

   - First time only, enable biometrics:
     - `Features` → `Face ID` → **Enrolled** (or `Touch ID` on older devices).
   - Then simulate success or failure:
     - `Features` → `Face ID` → **Matching Face** → authentication **success**.
     - `Features` → `Face ID` → **Non-matching Face** → authentication **failure**.

When authentication **succeeds**, the app executes the transfer and navigates to the **Success** screen.  
When authentication **fails**, the app shows an error message and stays on the Confirm screen.

### 14.3 Android Emulator (fingerprint)

1. Run the app on an Android emulator (`npx react-native run-android`).
1. On the Confirm screen, tap the confirm button to show the native fingerprint dialog.
1. Open the emulator’s extended controls:

   - Click the `…` (More) button on the emulator side toolbar.
   - Go to the **Fingerprint** section.

1. Use the controls to simulate authentication:

   - **Touch sensor** → simulate a successful fingerprint → transfer succeeds.
   - **(If available) Fail** → simulate a failed fingerprint → transfer fails.

If the emulator does not have fingerprint configured, set it up inside the emulator’s Settings first (add a screen lock + fingerprint), then repeat the steps above.

This allows you to test both **success** and **failure** paths of biometric authentication without using a real device.

---

## Design decisions and challenges

### Overall architecture

- **React Native + TypeScript** was used to meet the cross-platform requirement while retaining strong typing for screens, services and navigation. Types catch a lot of mistakes (for example route params and API payloads) before they hit a device.
- The app is organised by responsibility under `src/`:

  - `screens/` – top-level UI and navigation.
  - `components/` – small reusable presentation components.
  - `services/` – side-effect logic such as fake API, biometrics and contacts.
  - `context/` – shared state (balance and history).
  - `hooks/` – reusable behavioural logic like biometric auth.
  - `types/` and `utils/` – shared types and pure helpers.

This separation keeps the “banking” logic out of the view layer so it is easier to swap out implementation details later when there is a real backend instead of the fake API.

### State and data flow

- A lightweight **AccountContext** provides `balance`, `history`, and helper methods like `refreshBalance` and `addToHistory`. For this scope, a full state library (Redux, Zustand, etc.) would have been overkill.
- All transfer logic goes through a single `processTransfer` function in `services/api.ts`. It simulates latency, network errors and insufficient funds. The UI only deals with high-level outcomes and does not know whether data is coming from a real backend or from in-memory state. However, basic validation like insufficient funds check is present to make UI more responsive and intuitive.
- **Recent transfers** are stored in the same context and rendered on the Transfer screen for quick re-sending. Tapping an entry directly populates the transfer fields above with its previous payload. This allows for editing if needed.

### Navigation and flow

- The user journey is modelled as follows: **Transfer → Confirm → Success** using `@react-navigation/native-stack`.
- A central `RootStackParamList` and shared `TransferPayload` / `TransferResult` types ensure navigation parameters stay in sync between screens. This removes a common source of bugs where one screen changes its props and another forgets to update.

### Security-related decisions

- The critical action (executing a transfer) is gated behind **biometric authentication** via `react-native-biometrics` and a custom `useBiometricAuth` hook.
- Validation happens first on the Transfer screen; the Confirm screen then shows a full summary. Only after the user has visually checked and confirmed do we trigger the biometric prompt. This mirrors typical flows in real banking apps and reduces accidental transfers.
- If biometrics are not available or fail, the app falls back to a simple **PIN prompt**. The PIN is intentionally hard-coded to **1234** and clearly marked as demo-only, but this shows how a backup factor could be integrated.
- No biometric or PIN data is logged; the “fake API” only receives generic payment information.

### Contacts and usability

- A dedicated `contacts` service uses `react-native-contacts` to request permission and convert the device address book into `Recipient` objects.
- The Transfer screen offers a **“Choose from contacts”** action to minimise manual entry and typos. If permission is denied, the UI degrades gracefully and the user can still type recipients manually.

### Validation and error handling

- Input validation (amount, recipient) lives in `utils/validation.ts`. Keeping it pure and centralised makes it easier to test and to change later without hunting through screens.
- The fake API intentionally triggers different error paths like network failures and insufficient funds. These are mapped to user-friendly messages instead of generic “something went wrong” alerts.

### Performance considerations

- Lists such as **recent transfers** and **contacts** use `FlatList` with stable keys and lightweight row components.
- Context only stores what really needs to be shared between screens (balance and history). Local UI state stays inside each screen to avoid unnecessary re-renders.

### Real-world challenges encountered

- **React Native environment setup**: getting a modern React Native CLI running smoothly required more than just installing Node. Older Node 20.x versions were missing newer APIs like `util.styleText`, which caused the Metro bundler to crash until Node 22 (or a newer 20.x LTS) was installed via `nvm`, dependencies were reinstalled, and the project was always run under the correct Node version.

- **Xcode & iOS toolchain (coming from desktop-focused work)**: since I am working mostly with desktop apps nowadays, this meant that the iOS toolchain wasn’t set up at all. Xcode needed to be installed from the App Store, `xcode-select` had to be pointed to the full Xcode app (not just Command Line Tools), and `xcodebuild -runFirstLaunch` had to be run to accept licenses and install components. On top of that, CocoaPods would not install with my current system's Ruby 2.6, so a newer Ruby from Homebrew and proper PATH configuration were required before `pod install` would succeed.

- **Native dependencies and pods**: getting navigation, biometrics and contacts all working required installing multiple native modules and running `pod install`. A common real-world issue was missing modules like `react-native-screens`, which was fixed by installing the correct peer dependencies and clearing the Metro cache.
- **TypeScript issues**: `react-native-biometrics` exposes `BiometryType` as a type and `BiometryTypes` as a value. Using the wrong one caused type errors that needed a bit of digging through the library docs.

- **Device differences**: not all simulators/devices support biometrics in the same way. The hook had to handle “no biometric hardware” cleanly instead of assuming Face ID / Touch ID was present.
- **Permissions for contacts**: iOS and Android required different steps (Info.plist usage description vs Android manifest permissions). Until these were configured correctly, contact fetching either silently returned nothing or failed.
