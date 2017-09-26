'use strict';

import React, {Component} from 'react';
import {
    Dispatcher,
    ReduceStore,
    Container
} from '../../src/index';
import {expect} from 'chai';
import {shallow} from 'enzyme';

describe('Test Container', ()=>{ 
    class FakeStore extends ReduceStore
    {
        getInitialState()
        {
            return [];
        }

        reduce(state, action)
        {
            return action;
        }
    }
    let dispatcher;
    let store; 
    beforeEach(()=>{
        dispatcher = new Dispatcher();
        store = new FakeStore(dispatcher); 
    });
    it('could register with store', ()=>{
       class FakeComponent extends Component
       {
            static getStores()
            {
                return [store];
            }

            static calculateState(prevState)
            {
                return {foo:'bar'};
            }

            render()
            {
                return <div>{this.state.foo}</div>;
            }
       }
       let FakeContainer = Container(FakeComponent); 
       let vDom = <FakeContainer />;
       const actual = shallow(vDom).html();
       expect(actual).to.equal('<div>bar</div>');
    });

    
    it('could work with dispatcher', ()=>{
       let calculateTimes = 0;
       class FakeComponent extends Component
       {
            static getStores()
            {
                return [store];
            }

            static calculateState(prevState)
            {
                const state = store.getState();
                calculateTimes++;
                return {aaa:state.aaa};
            }

            render()
            {
                return <div>{this.state.aaa}</div>;
            }
       }
       const FakeContainer = Container(FakeComponent); 
       expect(calculateTimes).to.equal(0);
       const vDom = <FakeContainer />;
       expect(calculateTimes).to.equal(0);
       const html  = shallow(vDom);
       expect(calculateTimes).to.equal(1);
       dispatcher.dispatch({aaa: 'Hello dispatcher!'});
       expect(calculateTimes).to.equal(2);
       expect(html.html()).to.equal('<div>Hello dispatcher!</div>');
       html.unmount();
       dispatcher.dispatch({aaa: 'Hello Unmount!'});
       expect(calculateTimes).to.equal(2);
    });

    it('could work with props', ()=>{
       let getStoresProps = null;
       let calculateStateProps = null;
       class FakeComponent extends Component
       {
            static getStores(props)
            {
                getStoresProps = props;
                return [store];
            }

            static calculateState(prevState, props)
            {
                calculateStateProps = props;
                const state = store.getState();
                return {foo: props.foo};
            }

            render()
            {
                return <div>{this.state.foo}</div>;
            }
       }
       const FakeContainer = Container(
            FakeComponent,
            {
                withProps: true
            }
        ); 
       let changeFoo;
       class Parent extends Component
       {
            constructor(props) 
            {
                super(props);
                changeFoo = (v) => {
                    this.setState({foo: v});
                };
            }

            render()
            {
                let foo = null;
                if (this.state) {
                    foo = this.state.foo; 
                }
                return <FakeContainer foo={foo} />;
            }
       }
       const vDom = <Parent />;
       const html  = shallow(vDom);
       expect(getStoresProps).to.equal(null);
       expect(calculateStateProps).to.equal(null);
       let actual = html.html();
       expect(getStoresProps).to.deep.equal({ foo: null });
       expect(calculateStateProps).to.deep.equal({ foo: null });
       changeFoo('bar'); 
       expect(html.html()).to.equal('<div>bar</div>');
       expect(getStoresProps).to.deep.equal({ foo: 'bar' });
       expect(calculateStateProps).to.deep.equal({ foo: 'bar' });
    });
});
