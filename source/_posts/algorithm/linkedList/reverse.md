---
title: 反转链表
date: 2022-07-18 21:55:44
categories: algorithm
---

## 1. 翻转一个链表

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
    let curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
  }
}
```