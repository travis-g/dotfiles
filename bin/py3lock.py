#!/usr/bin/python2
#
# from http://redd.it/35m141

import os
import xcb
from xcb.xproto import *
from PIL import Image

"""
  requires:
    python2
    python2-pillow (AUR)
    xpyb (AUR)
"""


XCB_MAP_STATE_VIEWABLE = 2

LOCK_IMG = '/tmp/py3lock.png'
LOCK_CMD = 'i3lock -i '+LOCK_IMG

PIXEL_SIZE = 8 

#options: NEAREST, BILINEAR, BICUBIC, LANCZOS
RESIZE_METHOD = Image.NEAREST

def screenshot():
  os.system('import -window root ' + LOCK_IMG)

def xcb_fetch_windows():
  """ Returns an array of rects of currently visible windows. """

  x = xcb.connect()
  root = x.get_setup().roots[0].root

  rects = []

  # iterate through top-level windows
  for child in x.core.QueryTree(root).reply().children:
    # make sure we only consider windows that are actually visible
    attributes = x.core.GetWindowAttributes(child).reply()
    if attributes.map_state != XCB_MAP_STATE_VIEWABLE:
      continue

    rects += [x.core.GetGeometry(child).reply()]

  return rects

def obscure_image(image):
  """ Obscures the given image. """
  size = image.size

  image = image.resize((size[0] / PIXEL_SIZE, size[1] / PIXEL_SIZE), RESIZE_METHOD)
  image = image.resize((size[0], size[1]), RESIZE_METHOD)

  return image

def obscure(rects):
  """ Takes an array of rects to obscure from the screenshot. """
  image = Image.open(LOCK_IMG)

  for rect in rects:
    area = (
      rect.x, rect.y,
      rect.x + rect.width,
      rect.y + rect.height
    )

    cropped = image.crop(area)
    cropped = obscure_image(cropped)
    image.paste(cropped, area)

  image.save(LOCK_IMG)

def lock_screen():
  os.system(LOCK_CMD)

if __name__ == '__main__':
  # 1: Take a screenshot.
  screenshot()

  # 2: Get the visible windows.
  rects = xcb_fetch_windows()

  # 3: Process the screenshot.
  obscure(rects)

  # 4: Lock the screen
  lock_screen()
