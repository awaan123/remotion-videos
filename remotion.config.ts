import { Config } from "@remotion/cli/config";

// Adobe Stock requires NO audio for background motion graphics
Config.setAudioCodec(null);

// Best standard codec for stock video compatibility
Config.setCodec("h264");
Config.setVideoImageFormat("jpeg");
Config.setCrf(16); // Visually lossless quality
Config.setOverwriteOutput(true);
