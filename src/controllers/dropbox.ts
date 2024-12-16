import { BadRequestError, InternalServerError } from "../utils/funcs/errors"
import { Controller } from "../utils/types/generic"
import crypto from 'crypto'
import axios from 'axios'

const DROPBOX_TOKEN_URL = process.env.DROPBOX_TOKEN_URL
const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI
const CLIENT_URL = process.env.CLIENT_URL

export const dropbox: Controller = {
  authDropbox: async(_, res) => {
    try {
      const state = crypto.randomBytes(16).toString('hex')
      const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${CLIENT_URL}${DROPBOX_REDIRECT_URI}` 

      res.status(200).json({ auth_url: authUrl })
    } catch (err: unknown) {
      InternalServerError("auth", "dropbox", res, err)
    }
  },

  authDropboxCallback: async(req, res) => {
    try {
      const { code, state } = req.query

      if (!code || !state) {
        return BadRequestError("Authorization code and state", res)
      }

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

          // Send back the access token and any other necessary data to the frontend
        res.status(200).json({
          access_token,
          refresh_token,
          expires_in,
        })
      }
    } catch (err: unknown) {
      InternalServerError("get", "dropbox access token", res, err)
    }
  }
}