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

**题解**

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

**样例**

比如，图中二叉树的最大深度是3

![depth](images/tree/2.png)

**题解**

深度优先搜索

```javascript
  var maxDepth = function(root) {
    if(!root) return 0
    return Math.max(maxDepth(root.left),maxDepth(root.right))+1
};
```

## 3. 翻转一个二叉树

**描述：**

给一棵二叉树的根节点 root ，翻转这棵二叉树，并返回其根节点。

**样例**

![reverseTree](images/tree/3.png)
输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]

**题解**

```javascript
var invertTree = function(root) {
    if (!root) {
      return null
    }
    return {
      val: root.val,
      left: invertTree(root.right),
      right: invertTree(root.left)
    }
};
```

## 4. 合并两个二叉树


**描述**

给出两棵二叉树： root1 和 root2 。

想象一下，当你将其中一棵覆盖到另一棵之上时，两棵树上的一些节点将会重叠（而另一些不会）。你需要将这两棵树合并成一棵新二叉树。合并的规则是：如果两个节点重叠，那么将这两个节点的值相加作为合并后节点的新值；否则，不为 null 的节点将直接作为新二叉树的节点。

返回合并后的二叉树。

**样例**

![mergeTree](images/tree/4.png)

输入：root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
输出：[3,4,5,5,4,null,7]

**题解**

```javascript
var mergeTrees = function(root1, root2) {
    //其中一棵树此结点不存在:返回另一棵树的结点
    if(root1 === null) return root2;
    if(root2 === null) return root1;
    //两棵树此结点都存在:生成一个结点，val为两棵树此结点val的和
    //对于根结点，如果上面两个if语句都没有进入，说明都存在根节点，值为两个根节点和
    let newTree = new TreeNode(root1.val + root2.val);
    //深度优先搜索，即朝一个方向搜索
    newTree.left = mergeTrees(root1.left, root2.left);
    newTree.right = mergeTrees(root1.right, root2.right);
    return newTree;//返回合并树
};
```