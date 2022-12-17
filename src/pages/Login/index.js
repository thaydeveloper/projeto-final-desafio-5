import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../services/instance";
import { getItem, setItem } from "../../services/storage";
import "./styles.css";

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup'
import { GlobalContext } from "../../providers/globalProvider";

const schema = object({
  email: string().trim().required('Este campo deve ser preenchido').matches(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
    , { message: 'Formato de e-mail invalido' }),
  senha: string().trim().required('Este campo deve ser preenchido')
})

function Login() {
  const token = getItem("token");
  const navigate = useNavigate();
  const { setShowUserModal } = useContext(GlobalContext)

  const { register, handleSubmit: hadleOnSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });


  let [erro, setErro] = useState({
    emailExiste: '',
    passwordFalid: '',

  })


  useEffect(() => {
    document.title = 'Página de Login'
  })

  async function handleSubmit(dados) {


    try {


      const { data } = await instance.post("/login", {
        email: dados.email,
        senha: dados.senha,
      });
      setItem("token", data.token);
      setShowUserModal(false)
      navigate("/home");
    } catch (error) {


      if (error.response.data.mensagem === 'E-mail não cadastrado') {
        setErro({ emailExiste: 'E-mail não cadastrado' })
        return
      }
      if (error.response.data.mensagem === 'Senha incorreta') {
        setErro({ passwordFalid: 'Senha incorreta' })
        return
      }

    }
  }

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  });

  return (
    <section className="loginPage fullSize">
      <aside className="asideLogin">
        <h1 className="size24 colorDarkGreen loginPhrase">
          Gerencie todos os pagamentos da sua empresa em um só lugar.
        </h1>
      </aside>

      <section className="containerLogin centerAlign">
        <form
          className="loginForm verticalAlign centerAlign colorDarkGray"
          onSubmit={hadleOnSubmit(handleSubmit)}
        >
          <h1 className="formH1 colorDarkGray size24">Faça seu login!</h1>

          <div
            className="inputAndLabel verticalAlign"
            style={{ marginBottom: "2rem" }}
          >
            <label className="size14 label" htmlFor="email">
              Email
            </label>

            <input
              {...register('email')}
              type="email"


              className={
                errors?.email || erro.emailExiste ? 'error input verticalAlign centerAlign size16 '
                  :
                  'input verticalAlign centerAlign size16'

              }
              onChangeCapture={() => setErro('')}
              placeholder="Digite seu e-mail"

            />
            {errors?.email && <span className='messageErro size16'>{errors?.email?.message}</span>}
            {erro.emailExiste && <span className='messageErro size16'>{erro.emailExiste}</span>}

          </div>

          <div
            className="inputAndLabel verticalAlign"
            style={{ marginBottom: "4rem" }}
          >
            <div className="forgotPassword">
              <label
                className="size14 label"
                htmlFor="password"
                style={{ margin: "0" }}
              >
                {" "}
                Senha{" "}
              </label>
              <a
                className="link colorPink nunito"
                href="https://google.com"
                style={{ margin: "0" }}
              >
                {" "}
                Esqueceu a senha?{" "}
              </a>
            </div>

            <input
              {...register('senha')}
              type="password"


              placeholder="Digite sua senha"
              onChangeCapture={() => setErro('')}
              className={
                errors?.senha || erro.passwordFalid ? 'error input verticalAlign centerAlign size16 '
                  :
                  'input verticalAlign centerAlign size16'

              }

            />
            {errors?.senha && <span className='messageErro size16'>{errors?.senha?.message}</span>}
            {erro.passwordFalid && <span className='messageErro size16'>{erro.passwordFalid}</span>}

          </div>
          <button
            className="button loginButton"
            type="submit"
            style={{ marginBottom: "15px" }}
          >
            Entrar
          </button>

          <span className="formSpan size16 nunito">
            Ainda não possui uma conta?&nbsp;
            <Link to="/register" className="link colorPink nunito">
              Cadastre-se
            </Link>
          </span>
        </form>
      </section>
    </section>
  );
}

export default Login;
