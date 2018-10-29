#!/usr/bin/env python
from PIL import Image
import os
import shutil
import re
from multiprocessing import Process
import functools
from parallel import MultiConsumer, MultiProducer

MX_WIDTH = 1024
staticPath = os.path.join("..", "public")
# digestPath = staticPath.replace("static_assets", "static")

class ScanIMG(MultiProducer):
    def task_put(self):
        for p, _, f in os.walk(staticPath):
            if len(f): print('  |> In dir:', p)
            for tf in f:
                self.add_task((tf, p))

class CompressIMG(MultiConsumer):
    def execute(self, task):
        tf, p = task
        postfix = tf.split('.')[-1]
        PIC_COMP = ['jpg', 'jpeg', 'png']
        if postfix.lower() in PIC_COMP:
            dep = len(p.split(os.pathsep)) + 1
            print('  '*dep, '|>', tf)
            path = os.path.join(p, tf)
            im = Image.open(path)
            w, h = im.size
            if w > MX_WIDTH:
                h = h * MX_WIDTH // w
                w = MX_WIDTH
            print('  '*(dep+1), "=> {} * {}".format(w, h))
            im = im.resize((w, h), Image.ANTIALIAS)
            im.save(path)
if __name__ == '__main__':
    print("Start building assets...")
    
    print("Step#1 compressing images...")
    scanner = ScanIMG(CompressIMG)
    scanner.start()
    scanner.join()
    print("Finished!")