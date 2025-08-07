import{d as w,b as l,_,a as N,c as x,e as U}from"./toConsumableArray-BwQuJZQe.js";import{a as s,aa as h,t as q}from"./index-BmTDuvZb.js";import{a1 as D,a2 as S,X as L,U as W,q as X,a3 as F}from"./context-Du5Tb9SW.js";function G(n){return n.replace(/-(.)/g,function(e,o){return o.toUpperCase()})}function H(n,e){X(n,"[@ant-design/icons] ".concat(e))}function k(n){return w(n)==="object"&&typeof n.name=="string"&&typeof n.theme=="string"&&(w(n.icon)==="object"||typeof n.icon=="function")}function I(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return Object.keys(n).reduce(function(e,o){var r=n[o];switch(o){case"class":e.className=r,delete e.class;break;default:delete e[o],e[G(o)]=r}return e},{})}function T(n,e,o){return o?h.createElement(n.tag,l(l({key:e},I(n.attrs)),o),(n.children||[]).map(function(r,a){return T(r,"".concat(e,"-").concat(n.tag,"-").concat(a))})):h.createElement(n.tag,l({key:e},I(n.attrs)),(n.children||[]).map(function(r,a){return T(r,"".concat(e,"-").concat(n.tag,"-").concat(a))}))}function E(n){return D(n)[0]}function R(n){return n?Array.isArray(n)?n:[n]:[]}var J=`
.anticon {
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon > * {
  line-height: 1;
}

.anticon svg {
  display: inline-block;
}

.anticon::before {
  display: none;
}

.anticon .anticon-icon {
  display: block;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon-spin::before,
.anticon-spin {
  display: inline-block;
  -webkit-animation: loadingCircle 1s infinite linear;
  animation: loadingCircle 1s infinite linear;
}

@-webkit-keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`,K=function(e){var o=s.useContext(S),r=o.csp,a=o.prefixCls,c=o.layer,t=J;a&&(t=t.replace(/anticon/g,a)),c&&(t="@layer ".concat(c,` {
`).concat(t,`
}`)),s.useEffect(function(){var m=e.current,C=L(m);W(t,"@ant-design-icons",{prepend:!c,csp:r,attachTo:C})},[])},M=["icon","className","onClick","style","primaryColor","secondaryColor"],u={primaryColor:"#333",secondaryColor:"#E6E6E6",calculated:!1};function Q(n){var e=n.primaryColor,o=n.secondaryColor;u.primaryColor=e,u.secondaryColor=o||E(e),u.calculated=!!o}function V(){return l({},u)}var d=function(e){var o=e.icon,r=e.className,a=e.onClick,c=e.style,t=e.primaryColor,m=e.secondaryColor,C=_(e,M),y=s.useRef(),f=u;if(t&&(f={primaryColor:t,secondaryColor:m||E(t)}),K(y),H(k(o),"icon should be icon definiton, but got ".concat(o)),!k(o))return null;var i=o;return i&&typeof i.icon=="function"&&(i=l(l({},i),{},{icon:i.icon(f.primaryColor,f.secondaryColor)})),T(i.icon,"svg-".concat(i.name),l(l({className:r,onClick:a,style:c,"data-icon":i.name,width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true"},C),{},{ref:y}))};d.displayName="IconReact";d.getTwoToneColors=V;d.setTwoToneColors=Q;function z(n){var e=R(n),o=N(e,2),r=o[0],a=o[1];return d.setTwoToneColors({primaryColor:r,secondaryColor:a})}function Y(){var n=d.getTwoToneColors();return n.calculated?[n.primaryColor,n.secondaryColor]:n.primaryColor}var Z=["className","icon","spin","rotate","tabIndex","onClick","twoToneColor"];z(F.primary);var v=s.forwardRef(function(n,e){var o=n.className,r=n.icon,a=n.spin,c=n.rotate,t=n.tabIndex,m=n.onClick,C=n.twoToneColor,y=_(n,Z),f=s.useContext(S),i=f.prefixCls,g=i===void 0?"anticon":i,j=f.rootClassName,A=q(j,g,x(x({},"".concat(g,"-").concat(r.name),!!r.name),"".concat(g,"-spin"),!!a||r.name==="loading"),o),p=t;p===void 0&&m&&(p=-1);var $=c?{msTransform:"rotate(".concat(c,"deg)"),transform:"rotate(".concat(c,"deg)")}:void 0,P=R(C),b=N(P,2),B=b[0],O=b[1];return s.createElement("span",U({role:"img","aria-label":r.name},y,{ref:e,tabIndex:p,onClick:m,className:A}),s.createElement(d,{icon:r,primaryColor:B,secondaryColor:O,style:$}))});v.displayName="AntdIcon";v.getTwoToneColor=Y;v.setTwoToneColor=z;export{v as I};
