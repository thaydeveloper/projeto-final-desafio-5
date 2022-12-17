import './styles.css';

import FormLeft from '../../components/FormEmail';
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState} from "react";


import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import {object, string} from 'yup'

import instance from '../../services/instance'

import LineHoriGreen from '../../assets/register/horizontalLineGreen.svg'
import LineHoriGray from '../../assets/register/horizontalLineGray.svg'

const schema = object({
  nome: string().trim().required('Este campo deve ser preenchido').max(20).matches(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, {message:'Somente letras'}),
  email: string().trim().required('Este campo deve ser preenchido').matches(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
,{message:'Formato de e-mail invalido'})
})

function Registration() {
  const navigate = useNavigate();
  let [erro, setErro] = useState('')
  
  const { register, handleSubmit:hadleOnSubmit,  formState: { errors } } = useForm({resolver:yupResolver(schema)});

  
    

 
  
  async function handleSubmit(data) {
    
    try {

      await instance.post('/email', {
        email:data.email
      })

      localStorage.setItem("nome", data.nome);
      localStorage.setItem("email", data.email);

      navigate('/password')

    } catch (error) {
      
      if(error.response.data.mensagem === "Já existe usuário cadastrado com o e-mail informado."){

       setErro('E-mail já cadastrado') 
      
      }
    }

  }
  
  useEffect(() => {
    document.title = 'Página de Cadastro'
  })
  
  
  return (
    <div className='container-registration'>
      
        <FormLeft/>
                
        <div className='container-right'>
  
          <form className='formRegister' onSubmit={hadleOnSubmit(handleSubmit)}>
              <h1
              className='formH1 colorDarkGray size24 weight700'
              >Adicione seus dados
              </h1>
                <div className='minWidth'>
                  <label className='size14 label colorLabel' htmlFor='nome'>Nome*</label>

                  <div className='minWidth top'>
                    <input
                    className={
                    errors?.nome ? 'error input verticalAlign centerAlign size16 '
                    : 
                    'input verticalAlign centerAlign size16'
                    }
                    {...register('nome')}
                    type='text'
                    placeholder='Digite seu nome'  
                         
                    /
                    >
                   
                    {errors?.nome && <span className='messageErro size16'>{errors?.nome?.message}</span>}
                    </div>
                  
                  <div className="minWidth top">
                    <label className='size14 label colorLabel ' htmlFor='email'>Email*</label>
        
                    <input
                    
                    className={
                    errors?.email || erro ? 'error input verticalAlign centerAlign size16 '
                    : 
                    'input verticalAlign centerAlign size16'
                    }
                    {...register('email')}
                    type='email'
                    placeholder='Digite seu email'
                    onChangeCapture={() =>setErro('')}
                    /
                    > 
                    {errors?.email && <span className='messageErro size16'>{errors?.email?.message}</span>}
                  </div>
                    {erro && <span className='messageErro size16'>{erro}</span>} 
                </div>                       
        
                <button
                type='submit'
                className='button nunito'
                
                >
                Continuar
                </button>
            
                <Link to={'/login'} className='nunito size18'>Já possui uma conta? Faça seu <span className='colorPink '> Login</span>
                </Link>

                <div className='container-img'>
                  <img src={LineHoriGreen} alt='line-green' />
                  <img src={LineHoriGray} alt='line-gray' />
                  <img src={LineHoriGray} alt='line-gray' />
                </div>    

            </form>
           
        </div>
    </div>

  );
}

export default Registration;