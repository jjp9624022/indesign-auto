#!/usr/bin/env python
# coding: utf-8

# In[ ]:

import time
from skimage import io,filters,measure,morphology,color
import os
import comtypes.client
app = comtypes.client.CreateObject('Photoshop.Application')


# In[ ]:


def copy_file_contents_to_clipboard(path):
    doc = app.Open(path)
    doc.layers[0].Copy()

    doc.Close(2) # 2 (psDoNotSaveChanges)

def create_layer_from_file(layer_name, path_from,path_to):
    copy_file_contents_to_clipboard(path_from)

    app.activeDocument = app.Open(path_to)
    layer = app.activeDocument.artLayers.add() # Create Layer
    layer.name = layer_name # Rename Layer

    app.activeDocument.activeLayer = layer # Select Layer
    app.activeDocument.Paste() # Paste into
    app.activeDocument.Close(1)


# In[ ]:


def delsmall( img0 ):
    img =color.rgb2gray(img0)
    thresh = filters.threshold_otsu(img)  #用otsu算法确定最佳分割阈值

    bwimg =(img>=(thresh))  #用阈值进行分割，生成二值图像
    labels = measure.label(bwimg)  #标记连通域
    bw =morphology.closing(img < thresh, morphology.square(2))
    #img1 = morphology.remove_small_objects(labels, min_size=5, connectivity=1)
    img2= morphology.remove_small_objects(bw, min_size=200, connectivity=1)
    return img2
    #io.imshow(img1)


# In[ ]:


import glob as gb

str='C:\\Users\\jjp\\Desktop\\test\\*.png'
out='C:\\Users\\jjp\\Desktop\\out\\'
psd='C:\\Users\\jjp\\Desktop\\PSD\\'
img_path = gb.glob(str)
for path in img_path:
    theimg  =delsmall(io.imread(path))
    io.imsave(out+path.split("\\")[-1],(1-theimg)*255)
    print(psd+path.split("\\")[-1].split(".")[-2]+'.psd')
    create_layer_from_file("new_layer",out+path.split("\\")[-1],psd+path.split("\\")[-1].split(".")[-2]+'.psd')
    time.sleep( 5 )





# In[ ]:
