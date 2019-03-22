import os
import comtypes.client
app = comtypes.client.CreateObject('Photoshop.Application') # CS6

# maya config
project_path = 'd:/project/alice/maya'
log_path     = project_path + '/log'
images_path  = project_path + '/images'
layers       = ['master', 'prop_matte', 'shadow', 'wall_matte']
passes       = ['beauty', 'N']

# psd opt
psd_opt = comtypes.client.CreateObject('Photoshop.PhotoshopSaveOptions') # CS6
psd_opt.annotations = False
psd_opt.alphaChannels = True
psd_opt.layers = True
psd_opt.spotColors = True
psd_opt.embedColorProfile = True

def get_image_size(path):
    doc = app.Open(path)
    size = (doc.width, doc.height)
    doc.Close(2) # 2 (psDoNotSaveChanges)
    return size

def copy_file_contents_to_clipboard(path):
    doc = app.Open(path)
    doc.layers[0].Copy()
    doc.Close(2) # 2 (psDoNotSaveChanges)

def create_layer_from_file(doc, layer_name, path):
    copy_file_contents_to_clipboard(path)

    app.activeDocument = doc
    layer = doc.artLayers.add() # Create Layer
    layer.name = layer_name # Rename Layer

    doc.activeLayer = layer # Select Layer
    doc.Paste() # Paste into

def composite_ma(ma):
    # 이름 정리
    name = os.path.splitext(os.path.basename(ma))[0] # hc_column_corridor
    path_tokens = os.path.dirname(os.path.abspath(ma)).split('\\')
    theme = path_tokens[-1] # HeartCastle
    category = path_tokens[-2] # Housing
    category_theme = category + '/' + theme # Housing/HeartCastle

    # 새 포토샵 문서를 만든다
    app.Preferences.RulerUnits = 1 # Pixel
    w, h = get_image_size( images_path + '/' + category_theme + '/' + name + '/masterLayer/beauty.tif' ) # 기본 뷰티를 이용해 그림 크기를 얻는다.
    doc = app.Documents.Add(w, h, 72, name, 2, 1, 1)
    app.activeDocument = doc

    # 파일로 부터 새로운 레이어를 만든다
    for layer in layers:
        create_layer_from_file(doc, layer , images_path + '/' + category_theme + '/' + name + '/' + layer + '/' + 'beauty.tif')

    # 저장한다
    psd_path = images_path + '/' + category_theme + '/' + name + ".psd"
    print(psd_path)
    doc.SaveAs(psd_path, psd_opt)
    doc.Close()

def composite(files):
    for file in files:
        composite_ma(file)

def get_include_list(filepath):
    f = open(filepath)
    content = f.readlines()
    content = [x.strip() for x in content] # 줄 끝에 '\n'를 제거.
    result = []
    for path in content:
        if path[0] != '#': # 주석 처리된 파일을 생략.
            result.append(path)
    return result

# main
if __name__ == '__main__':
    files = get_include_list('include.txt')
    composite(files)
