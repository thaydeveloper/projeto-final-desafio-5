import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './styles.css';

export default function TextFieldSizes() {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '43ch'},
      }}
      noValidate
      autoComplete="off"
    >
      <div className='container-form'>
        <h1>Adicione seus dados</h1>

        <span className='text-field'>
          Nome*
        </span>
        <TextField
          className='inputs-text'
          id="outlined-size-small"
          placeholder="Digite seu nome"
          size="small"

        />
        <span className='text-field'>
          Email*
        </span>
        <TextField
          className='inputs-text'
          id="outlined-size-small"
          placeholder='Digite seu e-mail'
          size="small"
        />
      </div>

    </Box>
  );
}