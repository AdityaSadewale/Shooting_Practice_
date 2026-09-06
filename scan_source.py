import os

root = 'src'
for dirpath, _, filenames in os.walk(root):
    for fname in filenames:
        if fname.endswith(('.js', '.jsx', '.ts', '.tsx')):
            path = os.path.join(dirpath, fname)
            try:
                with open(path, 'r', encoding='utf-8') as fh:
                    fh.read()
            except Exception as e:
                print(path, '->', repr(str(e)))
