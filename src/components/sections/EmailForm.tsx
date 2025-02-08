'use client';
import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea, Link, Card } from '@heroui/react';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { RowSteps } from '../ui/row-steps';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

export const EmailForm = () => {
  const router = useRouter();

  const [buttonState, setButtonState] = useState('normal');

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    if (buttonState !== 'success') {
      if (
        formData.email.trim() &&
        formData.subject.trim() &&
        formData.message.trim()
      ) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
  }, [formData, buttonState]);

  useEffect(() => {
    if (currentStep === 3) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [currentStep]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (stepIndex: number) => {
    if (stepIndex === 0) {
      router.push('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonState('loading');

    const data = {
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    const JSONdata = JSON.stringify(data);
    const endpoint = '/api/send';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);

    if (response.status === 200) {
      console.log('Message sent.');
      setButtonState('success');
      setCurrentStep(3);
    }
  };

  return (
    <>
      <div className='flex flex-col items-center'>
        <RowSteps
          color={currentStep === 3 ? 'success' : 'primary'}
          currentStep={currentStep}
          defaultStep={0}
          className='flex flex-col sm:flex-row'
          onStepChange={handleStepChange}
          steps={[
            { title: 'Inicio' },
            { title: 'Formulado' },
            { title: 'Enviado' },
          ]}
        />

        <Card
          className='grid md:grid-cols-2 my-12 py-24 gap-4 relative px-3 bg-opacity-95 md:max-w-[900px] md:max-h-[450px]'
          id='contact'
        >
          <div className='flex flex-col justify-center items-center'>
            <h5 className='text-xl font-bold my-3 text-primary'>
              Manten el contacto
            </h5>
            <p className='mb-4 max-w-md'>
              En búsqueda de nuevas oportunidades y siempre con la bandeja de
              entrada abierta. Si tienes alguna pregunta o solo quieres saludar,
              ¡haré lo posible por responderte!
            </p>
            <div className='flex flex-row gap-2'>
              <Link href='https://github.com/Fidoi' color='primary' isExternal>
                <GitHubIcon />
              </Link>
            </div>
          </div>
          <div>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
              <div className='flex flex-shrink gap-5'>
                <Input
                  isRequired
                  name='email'
                  type='email'
                  label='Email'
                  placeholder='you@example.com'
                  className='max-w-xs'
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <Input
                  name='subject'
                  type='text'
                  label='Nombre'
                  id='subject'
                  placeholder='Juanito perez'
                  className='max-w-xs'
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
              <Textarea
                name='message'
                id='message'
                label='Mensaje'
                placeholder='Ingresa tu mensaje'
                description='Escribe acá tu mensaje'
                className='max-w'
                value={formData.message}
                onChange={handleInputChange}
              />

              {buttonState === 'loading' ? (
                <Button color='secondary' isLoading>
                  Enviando...
                </Button>
              ) : buttonState === 'success' ? (
                <Button color='success' variant='shadow'>
                  Enviado!
                </Button>
              ) : (
                <Button
                  type='submit'
                  className='py-2.5 px-5 max-w'
                  color='primary'
                  disabled={currentStep !== 2}
                >
                  Enviar mensaje
                </Button>
              )}
            </form>
          </div>
        </Card>
      </div>
    </>
  );
};
