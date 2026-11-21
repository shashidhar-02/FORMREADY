# FormReady Privacy Model

## Privacy Principles

FormReady is engineered around one central promise: **your confidential documents stay in your browser**.

### 1. No File Transmission
All file decoding, image resizing, contrast enhancement, and PDF creation occur entirely within the browser's memory space using native Web APIs. The hosting server acts solely as a static file delivery layer.

### 2. No Analytics & No Cookies
- No Google Analytics, Mixpanel, or behavioral tracking SDKs.
- No session tracking cookies or fingerprinting scripts.
- No remote telemetry reporting file metadata, filenames, or dimensions.

### 3. Verification Method
Any user or security researcher can verify FormReady's local-only architecture:
1. Open your browser's Developer Tools (F12) and switch to the **Network** panel.
2. Select an image or PDF and execute any compression or fixing operation.
3. Observe that no HTTP POST/PUT requests or external fetches are initiated.
4. The application continues to operate even when the device is disconnected from the network.
