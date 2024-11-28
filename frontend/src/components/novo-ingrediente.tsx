'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { useState } from 'react'
import { createIngrediente } from '@/services/api'

export function NovoIngrediente() {
  const [isOpen, setIsOpen] = useState(false)

  const [ingrediente, setIngrediente] = useState({
    descricao: '',
    preco: 0,
    isAdicional: false
  })

  // Função para lidar com a mudança nos campos de input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target

    setIngrediente(prev => ({
      ...prev,
      [id]: type === 'number' ? parseFloat(value) : value
    }))
  }

  // Função para lidar com a mudança do checkbox
  const handleCheckboxChange = (checked: boolean | false) => {
    setIngrediente(prev => ({
      ...prev,
      isAdicional: checked ?? false // Garantindo um valor booleano
    }))
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await createIngrediente(ingrediente)
      console.log('Ingrediente criado:', ingrediente)
      setIsOpen(false)
    } catch (error) {
      console.error('Erro ao criar ingrediente:', error)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Plus />
        Ingrediente
      </Button>
      {isOpen && (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Ingrediente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-2 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descricao" className="text-right">
                  Descricao
                </Label>
                <Input
                  id="descricao"
                  type="text"
                  placeholder="Bacon"
                  value={ingrediente.descricao}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="preco" className="text-right">
                  Preço
                </Label>
                <Input
                  id="preco"
                  type="number"
                  value={ingrediente.preco}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="adicional" className="text-right">
                  Adicional
                </Label>
                <Checkbox
                  checked={ingrediente.isAdicional}
                  onCheckedChange={handleCheckboxChange}
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Cadastrar</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}