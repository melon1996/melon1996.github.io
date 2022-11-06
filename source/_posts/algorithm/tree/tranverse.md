---
title: 二叉树的遍历
date: 2022-11-06 16:17:59
categories: algorithm
---

## 二叉树

![二叉树](images/tree/1.png)

前序遍历-根左右：A-B-D-F-G-H-I-E-C
中序遍历-左根右：F-D-H-G-I-B-E-A-C
后序遍历-左右根：F-H-I-G-D-E-B-C-A

## 1. 实现二叉树的中序遍历

1. 递归方法
定义 `inorder(root)` 表示当前遍历到 `root` 节点的答案，那么按照定义，我们只要递归调用 `inorder(root.left)` 来遍历 `root` 节点的左子树，然后将 `root` 节点的值加入答案，再递归调用`inorder(root.right)` 来遍历 `root` 节点的右子树即可，递归终止的条件为碰到空节点。

```javascript
var inorderTraversal = function(root) {
    const res = [];
    const inorder = (root) => {
        if (!root) {
            return;
        }
        inorder(root.left);
        res.push(root.val);
        inorder(root.right);
    }
    inorder(root);
    return res;
};

```
2. 迭代方法
```javascript
var inorderTraversal = function(root) {
    const res = [];
    const stk = [];
    while (root || stk.length) {
        while (root) {
            stk.push(root);
            root = root.left;
        }
        root = stk.pop();
        res.push(root.val);
        root = root.right;
    }
    return res;
};

```

## 2. 给出一个二叉树的最大深度

比如，图中二叉树的最大深度是3

![depth](images/tree/2.png)

深度优先搜索

```javascript
  var maxDepth = function(root) {
    if(!root) return 0
    return Math.max(maxDepth(root.left),maxDepth(root.right))+1
};
```