import React, { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Center, Environment, CameraControls, Html } from '@react-three/drei'
import { Selection, Select, EffectComposer, Outline } from '@react-three/postprocessing'
import './App.css'

const STARTING_VIEW = {
  position: [-0.266, 0.108, -0.081],
  target: [0.031, 0.051, 0.017]
}

const VIEWS = {
  HOME: STARTING_VIEW,
  MONITOR: { 
    position: [-0.06, 0.092, 0.01], 
    target: [0.04, 0.09, 0.01] 
  },
  PAPERS: { 
    position: [-0.02, 0.11, -0.03], 
    target: [-0.01, 0.03, -0.03] 
  }
}

function Model({ path, ...props }) {
  const { scene } = useGLTF(path)
  
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true
      }
    })
  }, [scene])

  return <primitive object={scene} {...props} />
}

function MonitorScreen({ isOn, onClose }) {
  if (!isOn) return null;

  return (
    <Html transform distanceFactor={0.053} position={[0.0109, 0.104, -0.0002]} rotation={[0, -Math.PI / 2, 0]} occlude="blended">
      <div id="monitor">
        <div className="window-header">
          <span class="window-title">Projects</span>
          <div className="window-controls">
            <div id="cross" onClick={onClose}></div>
          </div>
        </div>

        <div id="monitor-content" onWheel={(e) => e.stopPropagation()}>
          <div class="project">
            <img src="/robot.png" alt="robot"></img>
            <div class="card">
              <div class="techStack">Cpp</div>
              <div class="title">
                Robot
              </div>
              <div class="description">Symulacja działania robota antropomorficznego</div>
              <div class="git"><a href="https://github.com/praha6248/Robot_arm" target="_blank" rel="noopener noreferrer">
                <img src="/git.png" alt="git" />
              </a></div>
            </div>
          </div>
          <div class="project">
            <img src="/grupowy.png" alt="aal"></img>
            <div class="card">
              <div class="techStack">Flutter</div>
              <div class="title">
                Assisted living
              </div>
              <div class="description">Aplikacja wspierająca osoby starsze i z niepełnosprawnościami mieszkające samodzielnie</div>
              <div class="git"><a href="https://github.com/praha6248/ambient-assisted-living-app" target="_blank" rel="noopener noreferrer">
                <img src="/git.png" alt="git" />
              </a></div>
            </div>
            
          </div>
          <div class="project">
            <img src="/sandbox.png" alt="sandbox"></img>
            <div class="card">
              <div class="techStack">React</div>
              <div class="title">
                Sandbox
              </div>
              <div class="description">Symulacja typu falling sand</div>
              <div class="git"><a href="https://github.com/praha6248/symulacja_falling_sand" target="_blank" rel="noopener noreferrer">
                <img src="/git.png" alt="git" />
              </a></div>
            </div>
            
          </div>
          <div class="project">
            <img src="/hackathon.png" alt="map"></img>
            <div class="card">
              <div class="techStack">Html</div>
              <div class="techStack">CSS</div>
              <div class="techStack">JS</div>
              <div class="title">
                Smart city
              </div>
              <div class="description">Interaktywna mapa Gdańska</div>
              <div class="git"><a href="https://github.com/praha6248/hackathon_smart_city" target="_blank" rel="noopener noreferrer">
                <img src="/git.png" alt="git" />
              </a></div>
            </div>
          </div>
          <div class="project">
            <img src="/budget.png" alt="budget"></img>
            <div class="card">
              <div class="techStack">C#</div>
              <div class="techStack">MySql</div>
              <div class="title">
                Budget app
              </div>
              <div class="description">Aplikacja umożliwiająca śledzenie wydatków</div>
              <div class="description">Aplikacja wspierająca osoby starsze i z niepełnosprawnościami mieszkające samodzielnie</div>
              <div class="git"><a href="https://github.com/praha6248/BudgetApp/" target="_blank" rel="noopener noreferrer">
                <img src="/git.png" alt="git" />
              </a></div>
            </div>
          </div>
        </div>
        
      </div>
    </Html>
  );
}

function CameraHandler({ focusTarget, isLocked }) {
  const controls = useRef()

  useEffect(() => {
    if (controls.current) {
      const goal = focusTarget || STARTING_VIEW
      controls.current.setLookAt(
        goal.position[0], goal.position[1], goal.position[2],
        goal.target[0], goal.target[1], goal.target[2],
        true
      )
    }
  }, [focusTarget])

  return (
    <CameraControls 
      ref={controls} 
      makeDefault 
      enabled={!isLocked}
      dampingFactor={0.2} 
      onChange={(e) => {
        const pos = controls.current.getPosition()
        const tar = controls.current.getTarget()
        console.log("AKTUALNY WIDOK:", {
          position: [
            Number(pos.x.toFixed(3)), 
            Number(pos.y.toFixed(3)), 
            Number(pos.z.toFixed(3))
          ],
          target: [
            Number(tar.x.toFixed(3)), 
            Number(tar.y.toFixed(3)), 
            Number(tar.z.toFixed(3))
          ]
        })
      }}
    />
  )
}

function MonitorModel({ isFocused, onClick }) {
  const { scene } = useGLTF('/obj/monitor2.glb')
  const [hovered, setHover] = useState(false)
  
  return (
    <group>
      <Select enabled={isFocused || hovered}>
        <primitive 
          object={scene} 
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        />
      </Select>
      {isFocused && <MonitorScreen isOn={isFocused} onClose={onClick} />}
    </group>
  )
}

function Papers({ isFocused, onClick }) {
  const { scene } = useGLTF('/obj/kartki.glb')
  const [hovered, setHover] = useState(false)
  return (
    <Select enabled={isFocused || hovered}>
      <primitive 
        object={scene} 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      />
    </Select>
  )
}

export default function App() {
  const [focusTarget, setFocusTarget] = useState(VIEWS.HOME)

  const handleSelect = (viewData) => {
  setFocusTarget(prev => {
    if (prev && prev.position[0] === viewData.position[0]) {
      return null
    }
    return viewData
  })
}
const isPapersFocused = focusTarget?.position[0] === VIEWS.PAPERS.position[0];

  return (
    <div id="app-wrapper">
      <header id="main-header">
        <div className="header-content">
          <h1 id="name">NATALIA PŁOCHA</h1>
          <nav className="nav-menu">
            <a 
            href="#" 
            className={
              focusTarget?.position[0] !== VIEWS.MONITOR.position[0] && 
              focusTarget?.position[0] !== VIEWS.PAPERS.position[0] 
              ? 'active' : ''
            }
            onClick={(e) => { e.preventDefault(); handleSelect(VIEWS.HOME); }}
          >
            Home
          </a>
            <a 
              href="#resume" 
              className={focusTarget?.position[0] === VIEWS.PAPERS.position[0] ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleSelect(VIEWS.PAPERS); }}
            >
              Resume
            </a>
            <a 
              href="#projects" 
              className={focusTarget?.position[0] === VIEWS.MONITOR.position[0] ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleSelect(VIEWS.MONITOR); }}
            >
              Projects
            </a>
          </nav>
        </div>
      </header>

      <Canvas shadows camera={{ position: STARTING_VIEW.position, fov: 45, near: 0.001 }}>
        <Suspense fallback={null}>
          <Environment preset="apartment" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 5, 1]} intensity={1.5} castShadow />

          <Selection>
            <EffectComposer multisampling={8} autoClear={false}>
              <Outline visibleEdgeColor="white" edgeStrength={3} width={1000} />
            </EffectComposer>

            <Center top>
              <MonitorModel 
                isFocused={focusTarget?.position[0] === VIEWS.MONITOR.position[0]}
                onClick={() => handleSelect(VIEWS.MONITOR)} 
              />
              
              <Papers 
                isFocused={focusTarget?.position[0] === VIEWS.PAPERS.position[0]}
                onClick={() => handleSelect(VIEWS.PAPERS)} 
              />
              
              <Model path="/obj/biurko.glb" />
              <Model path="/obj/akcesoria.glb" />
            </Center>
          </Selection>
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, -0.0001, 0]} 
            onClick={() => setFocusTarget(null)}
            receiveShadow 
          >
            <circleGeometry args={[0.1, 64]} /> 
            <meshStandardMaterial color="#1f1f1f" roughness={0.8} />
          </mesh>

          <CameraHandler 
            focusTarget={focusTarget} 
            isLocked={focusTarget?.position[0] === VIEWS.MONITOR.position[0]} 
          />
        </Suspense>
      </Canvas>
      {isPapersFocused && (
        <a 
          href="/Natalia_Plocha_CV.pdf"
          download="Natalia_Plocha_CV.pdf"
          id="download"
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          Download CV
        </a>
      )}
    </div>
  )
}