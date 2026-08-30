import { describe, it, expect, vi } from 'vitest'
import { beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sidebar from '../Sidebar.jsx'

const sessions = [
  { id: '1', title: 'React', prompt: 'React basics', createdAt: Date.now() - 60_000 },
  { id: '2', title: 'Node', prompt: 'Node streams', createdAt: Date.now() - 120_000 },
]

function renderSidebar(overrides = {}) {
  const props = {
    sessions,
    onLoadSession: vi.fn(),
    onDeleteSession: vi.fn(),
    hasMaterial: false,
    onStartOver: vi.fn(),
    sidebarOpen: true,
    onToggleSidebar: vi.fn(),
    ...overrides,
  }
  render(<Sidebar {...props} />)
  return props
}

describe('Sidebar', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('moves focus through the session list with arrow keys and activates with Enter', async () => {
    const user = userEvent.setup()
    const props = renderSidebar()

    const loadButtons = screen.getAllByRole('button', { name: /^Load session/ })
    expect(loadButtons).toHaveLength(2)

    loadButtons[0].focus()
    await user.keyboard('{ArrowDown}')
    expect(loadButtons[1]).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(loadButtons[0]).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')
    expect(props.onLoadSession).toHaveBeenCalledWith(sessions[1])
  })

  it('cycles the learner profile on click', async () => {
    const user = userEvent.setup()
    renderSidebar()

    const switchBtn = screen.getByRole('button', { name: 'Switch learner profile' })
    const initialName = switchBtn.textContent
    await user.click(switchBtn)
    expect(switchBtn.textContent).not.toBe(initialName)
  })

  it('reveals saved-session stats from the profile panel', async () => {
    const user = userEvent.setup()
    renderSidebar({
      sessions: sessions.map((session) => ({
        ...session,
        data: {
          flashcards: [{ question: 'a', answer: 'b' }, { question: 'c', answer: 'd' }],
          quiz: [{ question: 'q', options: ['a', 'b', 'c', 'd'], answer: 0 }],
        },
      })),
    })

    await user.click(screen.getByRole('button', { name: 'Show profile stats' }))

    expect(screen.getAllByText('Sessions')).toHaveLength(2)
    // Sessions badge + Sessions stat + Quiz stat all show "2"; Flashcards stat shows "4".
    expect(screen.getAllByText('2')).toHaveLength(3)
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('handles arrow keys when no sessions exist', async () => {
    const user = userEvent.setup()
    renderSidebar({ sessions: [] })

    expect(screen.getByText('No sessions yet')).toBeInTheDocument()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowUp}')
  })
})