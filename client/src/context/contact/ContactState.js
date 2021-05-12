import { useReducer } from 'react'
import ContactContext from './contactContext'
import contactReducer from './contactReducer'
import Axios from 'axios'
import { ADD_CONTACT, DELETE_CONTACT, SET_CURRENT, CLEAR_CURRENT, UPDATE_CONTACT, FILTER_CONTACTS, CLEAR_FILTER, CONTACT_ERROR, GET_CONTACTS, CLEAR_CONTACTS } from '../types'

const ContactState = props => {
  const initialState = {
    contacts: null,
    current: null,
    filtered: null,
    error: null
  }

  const [state, dispatch] = useReducer(contactReducer, initialState)

  // Get Contacts
  const getContacts = async () => {
    try {
      const res = await Axios.get('/api/contacts')
      dispatch({ type: GET_CONTACTS, payload: res.data })
    } catch (err) {
      dispatch({ type: CONTACT_ERROR, payload: err.response.message })
    }
  }

  // Add Contact
  const addContact = async contact => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const res = await Axios.post('/api/contacts', contact, config)
      dispatch({ type: ADD_CONTACT, payload: res.data })
    } catch (err) {
      dispatch({ type: CONTACT_ERROR, payload: err.response.message })
    }
  }

  // Update Contact
  const updateContact = async contact => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const res = await Axios.put(`/api/contacts/${contact._id}`, contact, config)
      dispatch({ type: UPDATE_CONTACT, payload: res.data })
    } catch (err) {
      dispatch({ type: CONTACT_ERROR, payload: err.response.message })
    }
  }

  // Delete Contact
  const deleteContact = async id => {
    try {
      const res = await Axios.delete(`/api/contacts/${id}`)
      dispatch({ type: DELETE_CONTACT, payload: id })
    } catch (err) {
      dispatch({ type: CONTACT_ERROR, payload: err.response.message })
    }
  }

  const clearContacts = () => {
    dispatch({ type: CLEAR_CONTACTS })
  }
  // Set Current Contact
  const setCurrent = contact => {
    dispatch({ type: SET_CURRENT, payload: contact })
  }

  // Clear Current Contact
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT })
  }

  // Filter Contacts
  const filterContacts = text => {
    dispatch({ type: FILTER_CONTACTS, payload: text })
  }

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER })
  }
  return <ContactContext.Provider value={{ contacts: state.contacts, current: state.current, filtered: state.filtered, error: state.error, getContacts, addContact, clearContacts, deleteContact, setCurrent, clearCurrent, updateContact, filterContacts, clearFilter }}>{props.children}</ContactContext.Provider>
}

export default ContactState
