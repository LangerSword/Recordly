import { resolveLinuxWindowSystem } from "./linuxWindowSystem";

export interface GpuSwitches {
	useAngle?: string;
	useGl?: string;
	disableFeatures?: string[];
	enableFeatures?: string[];
}

export function shouldForceLinuxEgl(env: NodeJS.ProcessEnv): boolean {
	return resolveLinuxWindowSystem("linux", env) !== "wayland";
}

export function getGpuSwitches(
	platform: NodeJS.Platform,
	env: NodeJS.ProcessEnv = process.env,
	electronVersion: string = process.versions.electron ?? "",
): GpuSwitches {
	if (platform === "darwin") {
		return {
			useAngle: "metal",
			disableFeatures: ["MacCatapLoopbackAudioForScreenShare"],
		};
	}

	if (platform === "win32") {
		return { useAngle: "d3d11" };
	}

	if (platform === "linux") {
		const majorVersion = Number.parseInt(electronVersion, 10);
		// Electron 39's default GL path works with hardware acceleration on
		// Mesa/AMD (verified live: unmasked renderer "ANGLE (AMD Radeon
		// radeonsi renoir, OpenGL 4.6)", stable context, no GPU-process
		// exits) — and it rejects --use-gl switches outright. No switch at
		// all is the correct configuration there; the angle switch above
		// stays for Electron 40+.
		if (Number.isFinite(majorVersion) && majorVersion < 40) {
			// Chromium 142 keeps VA-API video decode behind features (worked
			// out of the box only from Chromium 143). The editor preview
			// decodes VP9, so turn the GL decode paths on. The zero-copy GL
			// variant is the recommended performance path on EGL/Wayland.
			// RECORDLY_DISABLE_VAAPI=1 returns to plain software decode.
			if (env.RECORDLY_DISABLE_VAAPI === "1") {
				return {};
			}
			return {
				enableFeatures: [
					"AcceleratedVideoDecodeLinuxGL",
					"AcceleratedVideoDecodeLinuxZeroCopyGL",
					"VaapiIgnoreDriverChecks",
				],
			};
		}
		return {
			...(shouldForceLinuxEgl(env) ? { useGl: "angle" } : {}),
			disableFeatures: ["VaapiVideoDecoder", "VaapiVideoEncoder"],
		};
	}

	return {};
}
