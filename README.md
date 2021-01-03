
# hed
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/DenizAksimsek/hed)

:alert: WIP :alert:

<div align=center>

```
   __ _________     
  / // / __/ _ \    H    T    M    L
 / _  / _// // /    E  d  i  t  o  r 
/_//_/___/____/     ================
```

</div>

Edit shared parts of static HTML files.

```sh
hed --selector .site-footer site/*.html
vim HED__* # or any preferred text editor
# Edit and save files...
# If there are multiple different versions of the element, many files will be created.
# You can edit each one separately or delete the ones you don't want & make it same in all files.
# When you're done:
hed --end
```
