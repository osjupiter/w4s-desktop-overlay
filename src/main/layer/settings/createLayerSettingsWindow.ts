import {BrowserWindow, Rectangle} from "electron";

import {isDev} from "../../dev/dev";
import {getLayerSession} from "../session/getLayerSession";
import {setWindowPageWithLayerSourceURL} from "../source/setWindowPageWithLayerSourceURL";
import {LayerSettingsWindow} from "./LayerSettingsWindow";

type Size = {
  width: number;
  height: number;
};

const centerBounds = (
  bounds: Rectangle,
  size: Size,
): {x: number; y: number; width: number; height: number} => ({
  x: bounds.x + (bounds.width - size.width) / 2,
  y: bounds.y + (bounds.height - size.height) / 2,
  width: size.width,
  height: size.height,
});

const centerParentWindow = (
  parent: BrowserWindow,
  child: BrowserWindow,
  size: Size,
): void => child.setBounds(centerBounds(parent.getBounds(), size));

const defaultWindowSize: Size = {
  width: 400,
  height: 600,
};

export const createLayerSettingsWindow = ({
  onClose,
  parent,
  sessionName,
  url,
}: {
  onClose: () => void;
  parent: BrowserWindow;
  sessionName: string;
  url?: string;
}): LayerSettingsWindow => {
  const win = new BrowserWindow({
    maximizable: false,
    minimizable: true,
    show: false,
    skipTaskbar: false,
    webPreferences: {
      sandbox: true,
      session: getLayerSession(sessionName),
    },
  });

  win.setMenu(null);

  centerParentWindow(parent, win, defaultWindowSize);

  setWindowPageWithLayerSourceURL(win, url);

  win.on("close", () => onClose());

  if (isDev) win.webContents.openDevTools({mode: "detach"});

  return {
    show() {
      win.show();
    },
  };
};