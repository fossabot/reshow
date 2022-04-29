# `Reshow Build`

> 
> React cloneElement and createElement alternaive.
>  
> To help u build anything. 
>

* GIT
   * https://github.com/react-atomic/reshow/tree/main/packages/reshow-build
* NPM
   * https://www.npmjs.com/package/reshow-build

## Usage

### Build without instance

```js
import build from "reshow-build";
import YourComponent from "./YourComponent";

const Comp = props => 
 build(YourComponent)(props, children /* optioninal*/ )
```

### Build with instance

```js
import build from "reshow-build";
import YourComponent from "./YourComponent";

const Comp = props => 
 build(<YourComponent />)(props, children /* optioninal*/ )
```

### Build with array
```js
import build from "reshow-build";
import YourComponent from "./YourComponent";

const Comp = props => 
 build([
    <YourComponent />,
    YourComponent,
    () => <YourComponent />,
    'div',
    'just string'
 ])(props, children /* optioninal*/ )
``` 

## More examples
[Examples](https://github.com/react-atomic/reshow/tree/main/packages/reshow-build/src/__tests__)
