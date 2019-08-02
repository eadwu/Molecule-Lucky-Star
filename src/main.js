/* @flow */
import fs from 'fs'
import path from 'path'
import WebGLHandler from 'webgl'

document.addEventListener('DOMContentLoaded', () => {
  const { join } = path
  const { readFileSync } = fs

  const shaderDirectory: string = join(__dirname, '..', 'shaders')
  const vertexShaderSource: string = readFileSync(join(shaderDirectory, 'shader.vs.glsl'), { encoding: 'utf8' })
  const fragmentShaderSource: string = readFileSync(join(shaderDirectory, 'shader.fs.glsl'), { encoding: 'utf8' })

  const webGLHandler: WebGLHandler = new WebGLHandler()
  const { webgl, VIDEO } = webGLHandler
  if (!webgl || !(webgl instanceof WebGL2RenderingContext)) return
  const VID: VIDEO = new VIDEO('op.mp4')
  const { canvas } = webgl
  const { video, fps } = VID

  const program: ?WebGLProgram = webGLHandler.constructProgram(webgl, {
    [webgl.VERTEX_SHADER]: vertexShaderSource,
    [webgl.FRAGMENT_SHADER]: fragmentShaderSource
  })

  const vertexArray = webgl.createVertexArray()
  webgl.bindVertexArray(vertexArray)

  VID.initBuffers(webgl, program, {
    vertPos: [webgl.ARRAY_BUFFER, null, null],
    vidTexture: [webgl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0
    ]), webgl.STATIC_DRAW]
  })

  const texture = webgl.createTexture()
  webgl.activeTexture(webgl.TEXTURE0)

  video.addEventListener('canplaythrough', () => {
    video.play()
    const vertexPositionBuffer: WebGLBuffer = VID.buffers['vertPos']
    setInterval(() => {
      VID.updateTexture(webgl, video, texture)

      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      webgl.viewport(0, 0, canvas.width, canvas.height)

      webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexPositionBuffer)
      const scaleFactor: number = canvas.width / video.clientWidth
      const scaledWidth: number = video.clientWidth * scaleFactor
      const marginWidthLeft: number = (canvas.clientWidth - scaledWidth) / 2
      webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
        marginWidthLeft, 0, scaledWidth, 0, marginWidthLeft, canvas.height, marginWidthLeft, canvas.height, scaledWidth, 0, scaledWidth, canvas.height
      ]), webgl.STATIC_DRAW)

      webgl.clearColor(0, 0, 0, 0)
      webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT)
      webgl.useProgram(program)
      webGLHandler.setUniforms(webgl, program, {
        uniform2f: ['resolution', canvas.width, canvas.height],
        uniform1i: ['frame', 0]
      })
      webgl.drawArrays(webgl.TRIANGLES, 0, 6)
    }, 1000 / fps)
  })
})
