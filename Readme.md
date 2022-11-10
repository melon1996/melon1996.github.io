## 创建文章

1. 执行以下命令，即可在source/_posts下新建以title为名的文件夹和md文件

```
hexo new <title>
```

2. 在指定文件夹中创建文章，需要执行，即可在source/_posts/<path>路径下创建名为title的md文件和文件夹
```
hexo new page --path <path> <title>
```

## 图片资源

图片存放在source/images文件夹中，使用时在md文件里通过`![title](images/pic.jpg)`显示图片，这种方式虽然在md文件中看不到图片，但在页面中是可以显示的。

## 部署

1. npm run clean -- 清除本地文件缓存

2. npm run build  -- 打包

3. npm run deploy  -- 部署