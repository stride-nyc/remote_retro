import { expect } from 'chai'

import userReducer from '../../web/static/js/reducers/user'


describe('user reducer', () => {
  describe('when no state is passed', () => {
    it('should return the initial state', () => {
      expect(userReducer(undefined, {})).to.deep.equal([])
    })
  })

  describe('when there are no users', () => {
    it('should handle ADD_USER', () => {
      const user = { given_name: 'Tiny Rick' }
      const action = { type: 'ADD_USER', user }
      const expectedState = [user]

      expect(userReducer([], action)).to.deep.equal(expectedState)
    })
  })

  describe('when there are existing users', () => {
    it('should handle ADD_USER', () => {
      const user = { given_name: 'Tiny Rick' }
      const action = { type: 'ADD_USER', user }
      const expectedState = [{ given_name: 'Morty' }, user]

      expect(userReducer([{ given_name: 'Morty' }], action)).to.deep.equal(expectedState)
    })
  })

  describe('when the action is unhandled', () => {
    it('returns the previous state', () => {
      const action = { type: 'IHAVENOIDEAWHATSHAPPENING' }
      const previousState = [{ given_name: 'Morty' }]

      expect(userReducer(previousState, action)).to.deep.equal(previousState)
    })
  })
})
