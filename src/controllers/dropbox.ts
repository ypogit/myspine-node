import { BadRequestError, InternalServerError } from "../utils/funcs/errors"
import { Controller } from "../utils/types/generic"
import { Session } from '../models'
import crypto from 'crypto'
import axios from 'axios'

const DROPBOX_TOKEN_URL = process.env.DROPBOX_TOKEN_URL
const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI
const CLIENT_URL = process.env.CLIENT_URL

export const dropbox: Controller = {
  authDropbox: async(req, res) => {
    try {
      if (!req.session) {
        return res.status(500).json({ message: 'Session is not available' });
      }

      let state;
      let session = await Session.readById(req.sessionID)
      const parsedSession = JSON.parse(session.sess)

      if (!parsedSession.state) {
        state = crypto.randomBytes(16).toString('hex');
        req.session.state = state;
        req.session.save((err: unknown) => {
          if (err) {
            console.error("Error saving session: ", err)
          } else {
            console.log("Session saved successfully!");
          }
        });
      } else {
        state = parsedSession.state
      }

      const auth_url = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${CLIENT_URL}${DROPBOX_REDIRECT_URI}`

      res.status(200).json({ auth_url })
    } catch (err: unknown) {
      InternalServerError("auth", "dropbox", res, err)
    }
  },

  authDropboxCallback: async(req, res) => {
    try {
      const { code, state } = req.query

      if (!state) {
        return res.status(400).json({ message: 'Missing state, possible CSRF attack' })
      }

      if (!req.session.state) {
        return res.status(400).json({ message: 'Session expired. Please try again.' })
      }

      if (state !== req.session.state) {
        console.error('State mismatch:', {
          requestState: state,
          sessionState: req.session.state,
        });
        return res.status(400).json({ message: 'State mismatch, possible CSRF attack' });
      }

      if (!code) {
        return res.status(400).json({ message: 'Authorization code is missing' });
      }

      delete req.session.state;

      if (!!DROPBOX_TOKEN_URL && !!DROPBOX_CLIENT_ID && !!DROPBOX_CLIENT_SECRET && !!DROPBOX_REDIRECT_URI) {
        // Exchange the code for an access token
        const response = await axios.post(
          DROPBOX_TOKEN_URL, 
          new URLSearchParams({
            code: code,
            client_id: DROPBOX_CLIENT_ID,
            client_secret: DROPBOX_CLIENT_SECRET,
            redirect_uri: `${CLIENT_URL}${DROPBOX_REDIRECT_URI}`,
            grant_type: 'authorization_code',
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

          // Extract the access token from the response
        const { access_token, refresh_token, expires_in } = response.data;

        if (!access_token) {
          return BadRequestError("Failed to retrieve access token.", res);
        }

          // Send back the access token and any other necessary data to the frontend
        res.status(200).json({ access_token, refresh_token, expires_in })
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        return BadRequestError("Invalid authorization code.", res);
      }

      InternalServerError("read", "dropbox access token", res, err)
    }
  }
}