import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cn } from '@/lib/utils'
import styles from './tabs.module.css'

/** Base UI accepts a string or a function of component state; prepend our base class to either. */
type ClassName<State> = string | ((state: State) => string | undefined) | undefined

function withBase<State>(base: string, className: ClassName<State>) {
  return typeof className === 'function' ? (state: State) => cn(base, className(state)) : cn(base, className)
}

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root className={withBase(styles.root, className)} {...props} />
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return <TabsPrimitive.List className={withBase(styles.list, className)} {...props} />
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return <TabsPrimitive.Tab className={withBase(styles.trigger, className)} {...props} />
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel className={withBase(styles.panel, className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
