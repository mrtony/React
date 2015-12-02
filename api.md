REACT JSX API
===




### React.DOM.div, React.DOM.h1
React提供了另一種型式去產生DOM: 使用`React.DOM.element`格式. [使用React.DOM.h1的範例](https://jsbin.com/xelumoluxe/edit?html,js,output)

但大部份的開發還是選擇jsx style:
```
var SubMessage = React.createClass({
  render: function() {
    return (<small>sub message</small>);
  }
});
```

---

# function inside class

### setState



