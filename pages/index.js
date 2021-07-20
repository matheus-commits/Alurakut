import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import ProfileRelationsBox, { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import ProfileSidebar from '../src/components/ProfileSideBar';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { useState, useEffect } from 'react';



export default function Home(props) {

  const [followers, setFollowers] = useState([]);
  const [comunidades, setComunidades] = useState([]);

  const usuarioAleatorio = props.githubUser;
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  function handleCreateCommunity(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const comunidade = {

      title: formData.get('title'),
      imageUrl: formData.get('image'),
      creatorSlug: usuarioAleatorio,
    }

    fetch('/api/comunities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comunidade)
    })
      .then(async (response) => {
        const dados = await response.json();
        console.log(dados.registroCriado);
        const comunidade = dados.registroCriado;
        const comunidadesAtualizadas = [...comunidades, comunidade];
        setComunidades(comunidadesAtualizadas)
      })

  }

  function getRandomUserFollowers() {
    fetch(`https://api.github.com/users/${usuarioAleatorio}/followers`)
      .then((serverResponse) => {
        return serverResponse.json();
      }).then((completeResponse) => {
        setFollowers(completeResponse)
      });
  }

  function getCommunities() {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'd388884eee39b31283d7827ef0845f',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "query": `query{
                                          allComunities {
                                            id
                                            title
                                            imageUrl
                                            creatorSlug
                                          }
                                        }
      `})
    }).then((response) => response.json())
      .then((fullResponse) => {

        const comunitiesFromDato = fullResponse.data.allComunities;
        console.log(comunitiesFromDato);
        setComunidades(comunitiesFromDato);

      });
  }

  useEffect(() => {
    getRandomUserFollowers();
    getCommunities();

  }, [])



  return (
    <>
      <AlurakutMenu />
      <MainGrid>

        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleCreateCommunity}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button type="submit">Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`}>
                      <img src={itemAtual.image} />
                    </a>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                Sefuidores({followers.length})
              </h2>
              <ul>
                {followers.slice(0,6).map((itemAtual) => {
                  return (
                    <li key={itemAtual}>
                      <a href={itemAtual.html_url} target="_blank" rel="noopener noreferrer" title="Site do usuário">
                        <img src={itemAtual.avatar_url} alt="Avatar do usuário" />
                        <span>{itemAtual.login}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </ProfileRelationsBoxWrapper>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const decodedToken = jwt.decode(token);
  const githubUser = decodedToken?.githubUser;

  if (!githubUser) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  return {
    props: {
      githubUser,
    }
  }
}
