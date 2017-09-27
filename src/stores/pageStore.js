'use strict';

import {Map} from 'immutable';
import {ReduceStore} from 'reshow-flux';
import dispatcher from '../actions/dispatcher';

class PageStore extends ReduceStore
{
    getInitialState()
    {
        return Map();
    }

    updateUrl(url)
    {
        history.pushState('','',url);
    }

    getMap = (k, state)=>
    {
        if (!state) {
            state = this.getState();
        }
        let v = state.get(k);
        if (v && v.toJS) {
            v = v.toJS();
        }
        if (!v) {
            v = {};
        }
        return v;
    }

    reduce (state, action)
    {
        if (action.url) {
            this.updateUrl(action.url);
        }
        switch (action.type) {
            case 'config/set':
                return state.merge(action.params);
            default:
                return state;
        }
    }
}

// Export a singleton instance of the store
export default new PageStore(dispatcher);
