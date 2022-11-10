---
title: 反转链表
date: 2022-07-18 21:55:44
tags: algorithm
---

## 1. 翻转一个链表

**描述：**
定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

**样例1：**

  输入：
  ```javascript
  链表=1->2->3->null
  ```
  输出：
  ```javascript
  3->2->1->null
  ```
**样例2：**

  输入：
  ```javascript
  链表 = 1->2->3->4->null
  ```
  输出：
  ```javascript
  4->3->2->1->null
  ```

**题解**

在遍历列表时，将当前节点的 next 指针改为指向前一个元素。由于节点没有引用其上一个节点，因此必须事先存储其前一个元素。在更改引用之前，还需要另一个指针来存储下一个节点。不要忘记在最后返回新的头引用！

```javascript
export class Solution {
  reverse(head) {
    let prev = null;
    while (head) {
        const next = head.next;
        head.next = prev;
        prev = head;
        head = next;
    }
    return prev;
  }
}
```


## 2. 翻转链表中第 m 个节点到第 n 个节点的部分


**样例1：**

  输入：
  ```javascript
  链表 = 1->2->3->4->5->NULL
  m = 2 
  n = 4
  ```
  输出：
  ```javascript
  1->4->3->2->5->NULL
  ```
**样例2：**

  输入：
  ```javascript
  链表 = 1->2->3->4->null
  m = 2
  n = 3
  ```
  输出：
  ```javascript
  1->3->2->4->NULL
  ```


**题解**

- 步骤一：先将待反转的区域反转
- 步骤二：把 pre 的 next 指针指向反转以后的链表头节点，把反转以后的链表的尾节点的 next 指针指向 succ
![题2](images/reverse/2.jpg)

```javascript
export class Solution {
  reverseLinkedList(head) {
    let pre = null;
    let cur = head;
    while (cur) {
      const next = cur.next;
      cur.next = pre;
      pre = cur;
      cur = next;
    }
  }
  reverseBetween(head, left, right) {
    // 因为头节点有可能发生变化，使用虚拟头节点可以避免复杂的分类讨论
    const dummyNode = new ListNode(-1);
    dummyNode.next = head;

    let pre = dummyNode;
    // 第 1 步：从虚拟头节点走 left - 1 步，来到 left 节点的前一个节点
    // 建议写在 for 循环里，语义清晰
    for (let i = 0; i < left - 1; i++) {
        pre = pre.next;
    }

    // 第 2 步：从 pre 再走 right - left + 1 步，来到 right 节点
    let rightNode = pre;
    for (let i = 0; i < right - left + 1; i++) {
        rightNode = rightNode.next;
    }

    // 第 3 步：切断出一个子链表（截取链表）
    let leftNode = pre.next;
    let curr = rightNode.next;

    // 注意：切断链接
    pre.next = null;
    rightNode.next = null;

    // 第 4 步：同第 206 题，反转链表的子区间
    this.reverseLinkedList(leftNode);

    // 第 5 步：接回到原来的链表中
    pre.next = rightNode;
    leftNode.next = curr;
    return dummyNode.next;
  }
}
```