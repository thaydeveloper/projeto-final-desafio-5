import React from 'react';
import './styles.css';

import registrationLineGreen from '../../assets/register/registrationLineGreen.svg';
import registrationNextGreen from '../../assets/register/registrationNextGreen.svg'

import registrationStepGreen from '../../assets/register/registrationStepGreen.svg';


function FormComponentEmail() {

  return(

      
        <>
            <aside className='asideSteps'>
              <div className='steps'>
                  <div className='linesAndCircles verticalAlign' >

                    <img src={registrationStepGreen} alt='Registration Green' />
                    <img src={registrationLineGreen} alt='Registration Line Green' />
                    <img src={registrationNextGreen} alt='Registration Step Green' />
                    <img src={registrationLineGreen} alt='Registration Line Green' />
                    <img src={registrationNextGreen} alt='Registration Next Green' />

                  </div>

                  <div className='verticalAlign textsSteps'>
                    <div>
                      <h1 className='GreenStep colorDarkGreen size18'>Cadastre-se</h1>
                      <span className='spanStep size14'>Por favor, escreva seu nome e e-mail</span>
                    </div>

                    <div>
                      <h1 className='GreenStep colorDarkGreen size18'>Escolha uma senha</h1>
                      <span className='spanStep size14'>Escolha uma senha segura</span>
                    </div>

                    <div>
                      <h1 className='GreenStep colorDarkGreen size18'>Cadastro realizado com sucesso</h1>
                      <span className='spanStep size14'>E-mail e senha cadastrados com sucesso</span>
                    </div>

                </div>
              </div>
            </aside>

              
          </>
  )
}
export default FormComponentEmail
