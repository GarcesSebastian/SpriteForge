interface ControllerKeyWords {
    up: string
    down: string
    left: string
    right: string
    jump: string
}

interface ControllerStatus {
    up: string[]
    down: string[]
    left: string[]
    right: string[]
    jump: string[]
    fall: string[]
    idle: string[]
}

interface ControllerConfig {
    up: Vector
    down: Vector
    left: Vector
    right: Vector
}

interface ControllerProps {
    keywords: ControllerKeyWords
    status: ControllerStatus
    speed?: number
    jumpForce?: number
}