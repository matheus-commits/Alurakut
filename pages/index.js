
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu,OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import ProfileRelationsBox from '../src/components/ProfileRelations';
import ProfileSidebar from '../src/components/ProfileSideBar';
import { useState, useEffect } from 'react';



export default function Home() {

  const [followers, setFollowers] = useState([]);
  const [comunidades, setComunidades] = useState([{
    id: '12802378123789378912789789123896123', 
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);
  
  const usuarioAleatorio = 'matheus-commits';
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  function handleCreateCommunity(e){
    e.preventDefault();
    const formData = new FormData();
    const comunidade = {
      id: new Date().toISOString(),
      title: formData.get('title'),
      image: formData.get('image'),
    }
    const comunidadesAtualizadas = [...comunidades, comunidade];
    setComunidades(comunidadesAtualizadas)

  }

  useEffect(()=>{
    fetch('https://api.github.com/users/peas/followers')
                      .then((serverResponse)=>{
                          return serverResponse.json();
                      }).then((completeResponse)=>{
                        setFollowers(completeResponse)
                      })
  },[])

  

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
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Comunidades" items={comunidades} />
          <ProfileRelationsBox title="Pessoas da comunidade" items={pessoasFavoritas} />
          <ProfileRelationsBox title="Seguidores" items={followers} />
        </div>
      </MainGrid>
    </>
  );
}
