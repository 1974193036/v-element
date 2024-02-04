import type { App } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/Button'
import Collapse, { CollapseItem } from '@/components/Collapse'
import Icon from '@/components/Icon'
import Message, { closeAll as closeMessageAll, createMessage } from '@/components/Message'
import Tooltip from '@/components/Tooltip'
import Dropdown from '@/components/Dropdown'
import Switch from '@/components/Switch'
import Input from '@/components/Input'

import './styles/index.css'

library.add(fas)

const components = [
  Button,
  Collapse,
  CollapseItem,
  Message,
  Icon,
  Tooltip,
  Dropdown,
  Switch,
  Input,
]

const install = (app: App) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export {
  install,
  Button,
  Collapse,
  CollapseItem,
  Message,
  closeMessageAll,
  createMessage,
  Icon,
  Tooltip,
  Dropdown,
  Switch,
  Input,
}

export default {
  install
}
