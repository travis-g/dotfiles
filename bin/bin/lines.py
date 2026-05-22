#!/usr/bin/env python3
import sys
import argparse
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

styles = plt.style.available
styles.sort()

parser = argparse.ArgumentParser()
parser.add_argument(
    "-H", "--height", help="figure height", dest="H", type=float, default=2
)
parser.add_argument(
    "-W", "--width", help="figure width", dest="W", type=float, default=6
)
parser.add_argument(
    "--spark", help="display output as a sparkline", action="store_true"
)
parser.add_argument(
    "--style",
    help="Matplotlib color style to use. Available styles: {}".format(
        ", ".join(styles)
    ),
    default="dark_background",
)
args = parser.parse_args()

# set the style sheet
plt.style.use(args.style)

# read the data
dataframe = pd.read_csv(sys.stdin)

# create the figure
fig, ax = plt.subplots(1, 1, figsize=(args.W, args.H))

# remove axes and graph cruft if we're graphing a sparkline
if args.spark:
    plt.margins(0, 0)
    ax.set_axis_off()

# plot the data and print it to stdout
plt.plot(dataframe)
plt.savefig(
    sys.stdout,
    format="svg",
    transparent=True,
    bbox_inches="tight",
    pad_inches=0,
)
