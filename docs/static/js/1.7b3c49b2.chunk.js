webpackJsonp([1],{730:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n.d(t,"RoseliaLyrics",function(){return s});var r=n(41),l=n(0),i=(n.n(l),n(55)),a=n(72),c=n(122),s=function(e){function t(t){var n=e.call(this,t)||this;return n.getLyric=function(){return r.b(n,void 0,void 0,function(){var e;return r.d(this,function(t){switch(t.label){case 0:this.setState({loading:!0}),t.label=1;case 1:return t.trys.push([1,4,,5]),[4,fetch("https://roselia.moe/blog/api/roselia/lyric/random")];case 2:return[4,t.sent().json()];case 3:return e=t.sent(),this.setState({loading:!1,lyric:e}),[3,5];case 4:return t.sent(),this.setState({loading:!1}),[3,5];case 5:return[2]}})})},n.state={lyric:{album:"",at:"",id:1,lyric:"",name:"",cnLyric:"",jpLyric:"",type:"album",link:"",picUrl:""},loading:!1},n}return r.c(t,e),t.prototype.componentDidMount=function(){this.getLyric()},Object.defineProperty(t.prototype,"currentLink",{get:function(){var e=this.state.lyric;return e.type+"/"+e.id+Object(c.d)(e.id)},enumerable:!0,configurable:!0}),t.prototype.render=function(){var e=this.state.lyric;return l.createElement(i.d.Dimmable,{as:i.r,blurring:!0,dimmed:this.state.loading},l.createElement(i.k.Group,null,l.createElement(i.k,null,l.createElement(i.k.Image,{size:"small",src:e.picUrl}),l.createElement(i.k.Content,{verticalAlign:"middle"},l.createElement(i.k.Header,null,l.createElement("p",null,l.createElement("span",null,e.jpLyric)),l.createElement("p",null,l.createElement("span",null,e.cnLyric))),l.createElement(i.k.Description,null,e.name),l.createElement(i.k.Extra,null,l.createElement(i.l,{as:a.b,to:this.currentLink,content:e.album}),l.createElement(i.l,{icon:"time",content:e.at})),l.createElement(i.k.Extra,null,l.createElement(i.a,{disabled:this.state.loading,size:"small",icon:"refresh",onClick:this.getLyric}))))))},t}(l.Component)}});
//# sourceMappingURL=1.7b3c49b2.chunk.js.map