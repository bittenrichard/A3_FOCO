// Local: src/features/auth/components/SignUpForm.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PhoneInput from 'react-phone-input-2';
import { translateFirebaseError } from '../utils/errorTranslator';

export function SignUpForm() {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(nome, empresa, telefone, email, password);
      toast.success('Conta criada com sucesso!', {
        description: 'Você será redirecionado para o login.',
      });
    } catch (error: any) {
      const translatedError = translateFirebaseError(error.message);
      toast.error(translatedError.title, {
        description: translatedError.description,
      });
      console.error("Erro detalhado no registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nome">Nome Completo</Label>
          <Input id="nome" placeholder="Seu nome" required value={nome} onChange={(e) => setNome(e.target.value)} disabled={isLoading} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="empresa">Empresa</Label>
          <Input id="empresa" placeholder="Nome da sua empresa" required value={empresa} onChange={(e) => setEmpresa(e.target.value)} disabled={isLoading} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="telefone">Telefone / WhatsApp</Label>
        <PhoneInput
            country={'br'}
            value={telefone}
            onChange={setTelefone}
            inputStyle={{ width: '100%', height: '2.5rem', fontSize: '0.875rem' }}
            containerClass="w-full"
            inputProps={{
                name: 'telefone',
                required: true,
                disabled: isLoading
            }}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Senha</Label>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isLoading ? 'Criando conta...' : 'Criar conta'}
      </Button>
    </form>
  );
}