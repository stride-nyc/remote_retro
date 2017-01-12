import React from 'react'
import { shallow } from 'enzyme'
import {expect, assert} from 'chai'

import UserList from '../../web/static/js/components/user_list'

describe('passed an array of users', () => {
  it('is renders a list item for each user', () => {
    const wrapper = shallow(<UserList users={["sam", "tony"]}/>)
    expect(wrapper.find('li')).to.have.length(2)
  })
})
