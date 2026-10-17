import { Config } from "@remotion/cli/config";

// Adobe Stock requires NO audio for background motion graphics
Config.setAudioCodec(null);

// Best standard codec for stock video compatibility
Config.setCodec("h264");

// Use PNG intermediate frames to avoid lossy JPEG compression artifacts / banding on black
Config.setVideoImageFormat("png");

// Professional high-bitrate broadcast quality (eliminates low quality warnings on Adobe Stock)
Config.setCrf(12);

Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
