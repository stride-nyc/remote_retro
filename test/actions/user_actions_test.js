import { expect } from 'chai'

import * as actionCreators from '../../web/static/js/actions/user'

describe('addUser', () => {
  it('should create an action to add user to users list', () => {
    const user = { given_name: 'Tiny Rick' }
    const expectedAction = { type: 'ADD_USER', user }

    expect(actionCreators.addUser(user)).to.deep.equal(expectedAction)
  })
})
