#!/usr/bin/env python3
import pandas as pd
import sys
pd.read_csv(sys.stdin, header=None).T.to_csv(sys.stdout, header=False, index=False)
