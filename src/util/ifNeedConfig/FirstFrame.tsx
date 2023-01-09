import 'antd/dist/antd.css'
import React from 'react'
import * as echarts from 'echarts/core'
import { GraphicComponent, GraphicComponentOption } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffectOnce } from 'Src/util/Hooks/useEffectOnce'

echarts.use([GraphicComponent, CanvasRenderer])

type EChartsOption = echarts.ComposeOption<GraphicComponentOption>

const FirstFrameChart = () => {
  useEffectOnce(() => {
    const myChart = echarts.init(document.querySelector('#first-frame') as HTMLElement)
    const option: EChartsOption = {
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: '易侦-协议模糊测试系统',
              fontSize: 80,
              fontWeight: 'bold',
              lineDash: [0, 200],
              lineDashOffset: 0,
              fill: 'transparent',
              stroke: '#1890ff',
              lineWidth: 1
            },
            keyframeAnimation: {
              duration: 3000,
              loop: false,
              keyframes: [
                {
                  percent: 0.7,
                  style: {
                    fill: 'transparent',
                    lineDashOffset: 200,
                    lineDash: [200, 0]
                  }
                },
                {
                  // Stop for a while.
                  percent: 0.8,
                  style: {
                    fill: 'transparent'
                  }
                },
                {
                  percent: 1,
                  style: {
                    fill: '#1890ff'
                  }
                }
              ]
            }
          }
        ]
      }
    }
    myChart.setOption(option)
  })

  return <div id='first-frame' style={{ width: '100%', height: '100vh' }} />
}

export default FirstFrameChart
