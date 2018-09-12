import React, {PureComponent} from 'react';
import {
    Section,
    dispatch
} from './../../../cjs/src/index';

import {expect} from 'chai';
import {shallow, mount, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('Test Section', ()=>{ 

   class TestEl extends PureComponent 
   {
        render()
        {
            return <div />;
        }
   }

   class FakeComponent extends PureComponent 
   {
        static defaultProps = {
            name: 'test'
        }

        render()
        {
            const {immutable, name} = this.props
            return (
            <Section name={name} immutable={immutable}>
                <TestEl ref={el=>this.el=el}/>
            </Section>
            );
        }
   }

   beforeEach(() => dispatch('config/reset'))

   it('Section is existed', () => {
       const vDom = <FakeComponent />;
       const uFake  = mount(vDom).instance();
       dispatch({
        section: {
            test: {
                shouldRender: true,
                aaa: {bbb: 'ccc'}
            }
        },
        I18N: { ddd: 'fff'}
       })
       expect(uFake.el.props.aaa).to.deep.equal({bbb: 'ccc'})
       expect(uFake.el.props.I18N).to.deep.equal({ddd: 'fff'})
   })

   it('Section is not existed', () => {
       const vDom = <FakeComponent name="xxx" />;
       const uFake  = mount(vDom).instance();
       dispatch({
        section: null,
       })
       expect('undefined' === typeof uFake.el).to.be.true
   })

   it('Section is existed with immutable', () => {
       const vDom = <FakeComponent immutable />;
       const uFake  = mount(vDom).instance();
       dispatch({
        section: {
            test: {
                shouldRender: true,
                aaa: {bbb: 'ccc'}
            }
        },
        I18N: { ddd: 'fff'}
       })
       expect(uFake.el.props.aaa.toJS()).to.deep.equal({bbb: 'ccc'})
       expect(uFake.el.props.I18N.toJS()).to.deep.equal({ddd: 'fff'})
   })

   it('Section is not existed with immutable', () => {
       const vDom = <FakeComponent name="xxx" immutable />;
       const uFake  = mount(vDom).instance();
       dispatch({
        section: null,
       })
       expect('undefined' === typeof uFake.el).to.be.true
   })
})