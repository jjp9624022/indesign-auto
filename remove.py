from skimage import io,filters,measure,morphology,color

from psd_tools2 import PSDImage

psd = PSDImage.open('example.psd')
psd.compose().save('example.png')

mask = psd[0].mask.topil()
print (mask)



img0 = io.imread('test.png') #读取图片
img =color.rgb2gray(img0)
thresh = filters.threshold_otsu(img)  #用otsu算法确定最佳分割阈值
#thresh=128
print(thresh)
print(img)
bwimg =(img>=(thresh))  #用阈值进行分割，生成二值图像
labels = measure.label(bwimg)  #标记连通域
bw =morphology.closing(img < thresh, morphology.square(2))
print(labels)



img1 = morphology.remove_small_objects(labels, min_size=5, connectivity=1)
img2= morphology.remove_small_objects(bw, min_size=200, connectivity=1)
#io.imshow(img1)

io.imsave('out.jpg',img1)
io.imsave('out2.jpg',img2*255)
